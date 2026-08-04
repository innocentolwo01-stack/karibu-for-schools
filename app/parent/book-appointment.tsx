import { useMemo, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Field, Header, Pill, Screen, Section, Segmented, StepBar } from '@/components/ui';
import { appointmentDates, children, subjects, teachers } from '@/data/mock';
import { colors } from '@/constants/theme';
import { MeetingMethod, useApp } from '@/context/AppContext';

export default function BookAppointment() {
  const { rescheduleId } = useLocalSearchParams<{ rescheduleId?: string }>();
  const { selectedChild, data, bookAppointment, updateAppointment } = useApp();
  const existing = data.appointments.find(item => item.id === rescheduleId);
  const existingSubject = subjects.find(item => item.name === existing?.subject);
  const [step, setStep] = useState(existing ? 3 : 1);
  const [childId, setChildId] = useState(existing?.childId ?? selectedChild.id);
  const [subjectId, setSubjectId] = useState(existingSubject?.id ?? subjects[0].id);
  const [method, setMethod] = useState<MeetingMethod>(existing?.method ?? 'video');
  const [date, setDate] = useState(existing?.date ?? appointmentDates[0].date);
  const [time, setTime] = useState(existing?.time ?? appointmentDates[0].times[0]);
  const [reason, setReason] = useState(existing?.reason ?? 'Discuss recent progress and how we can support improvement at home.');
  const [requiresApproval, setRequiresApproval] = useState(existing?.status === 'pending');
  const [saving, setSaving] = useState(false);

  const child = children.find(item => item.id === childId) ?? children[0];
  const subject = subjects.find(item => item.id === subjectId) ?? subjects[0];
  const teacher = teachers.find(item => item.id === subject.teacherId) ?? teachers[0];
  const dateOption = appointmentDates.find(item => item.date === date) ?? appointmentDates[0];
  const isBooked = (slot: string) => data.appointments.some(item => item.id !== existing?.id && item.teacherId === teacher.id && item.date === date && item.time === slot && item.status !== 'cancelled');
  const availableTimes = dateOption.times.filter(slot => !isBooked(slot));

  const title = useMemo(() => step === 1 ? 'Choose child and subject' : step === 2 ? 'How should you meet?' : step === 3 ? 'Choose an available slot' : 'Review appointment', [step]);

  const confirm = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 550));
    if (existing) {
      updateAppointment(existing.id, {
        childId: child.id,
        childName: child.name,
        subject: subject.name,
        teacher: teacher.name,
        teacherId: teacher.id,
        method,
        date,
        dateLabel: dateOption.label,
        time,
        duration: 20,
        reason,
        status: requiresApproval ? 'pending' : 'confirmed',
        meetingLink: method === 'video' ? 'https://meet.google.com/kar-ibu-demo' : undefined,
        phone: method === 'phone' ? '+256 700 123 456' : undefined,
        location: method === 'in-person' ? 'Greenhill Academy · Science Block · Room 12' : undefined,
      });
      router.replace(`/parent/appointment-confirmation/${existing.id}` as never);
      return;
    }
    const appointment = await bookAppointment({
      childId: child.id,
      childName: child.name,
      subject: subject.name,
      teacher: teacher.name,
      teacherId: teacher.id,
      method,
      date,
      dateLabel: dateOption.label,
      time,
      duration: 20,
      reason,
      requiresApproval,
    });
    router.replace(`/parent/appointment-confirmation/${appointment.id}` as never);
  };

  return (
    <Screen>
      <Header title={existing ? `Reschedule · ${title}` : title} subtitle={`Step ${step} of 4`} back onBack={() => step > 1 ? setStep(step - 1) : router.back()} />
      <StepBar current={step} total={4} />
      {step === 1 ? (
        <>
          <Section title="Select child" />
          <View style={styles.choiceRow}>{children.map(item => <Choice key={item.id} selected={childId === item.id} title={`${item.avatar} ${item.name}`} subtitle={`${item.className} ${item.stream}`} onPress={() => setChildId(item.id)} />)}</View>
          <Section title="Select subject" />
          {subjects.map(item => <Choice key={item.id} selected={subjectId === item.id} title={item.name} subtitle={item.teacher} onPress={() => setSubjectId(item.id)} />)}
        </>
      ) : null}
      {step === 2 ? (
        <>
          <Card style={styles.teacherCard}><Pill label="ASSIGNED TEACHER" tone="blue" /><Text style={styles.big}>{teacher.name}</Text><Text style={styles.sub}>{subject.name} · {child.name}</Text></Card>
          <Section title="Meeting type" />
          <Segmented value={method} onChange={setMethod} options={[{ value: 'video', label: 'Video call' }, { value: 'phone', label: 'Phone' }, { value: 'in-person', label: 'In person' }]} />
          <Card style={{ marginTop: 14 }}>
            <Text style={styles.methodTitle}>{method === 'video' ? 'Google Meet test call' : method === 'phone' ? 'Scheduled phone call' : 'Meet at school'}</Text>
            <Text style={styles.sub}>{method === 'video' ? 'A working test meeting link will be generated and included in the confirmation.' : method === 'phone' ? 'The confirmation will show the parent number and who should place the call.' : `Location: ${teacher.room}. Reception instructions will be included.`}</Text>
          </Card>
          <View style={styles.approval}><Text style={{ flex: 1, fontWeight: '900' }}>Require teacher approval</Text><Pressable onPress={() => setRequiresApproval(!requiresApproval)} style={[styles.toggle, requiresApproval && styles.toggleOn]}><View style={[styles.knob, requiresApproval && styles.knobOn]} /></Pressable></View>
        </>
      ) : null}
      {step === 3 ? (
        <>
          <Section title="Available dates" />
          <View style={styles.dateRow}>{appointmentDates.map(item => <Pressable key={item.date} onPress={() => { const firstAvailable = item.times.find(slot => !data.appointments.some(appointment => appointment.id !== existing?.id && appointment.teacherId === teacher.id && appointment.date === item.date && appointment.time === slot && appointment.status !== 'cancelled')); setDate(item.date); setTime(firstAvailable ?? item.times[0]); }} style={[styles.dateCard, date === item.date && styles.selected]}><Text style={[styles.dateText, date === item.date && { color: colors.red }]}>{item.label}</Text><Text style={styles.sub}>{item.times.length} slots</Text></Pressable>)}</View>
          <Section title={`${dateOption.label} · Available times`} />
          <View style={styles.timeGrid}>{dateOption.times.map(item => { const booked = isBooked(item); return <Pressable key={item} disabled={booked} onPress={() => setTime(item)} style={[styles.time, time === item && styles.selected, booked && styles.unavailable]}><Text style={[styles.timeText, time === item && { color: colors.red }, booked && { color: colors.muted }]}>{item}</Text><Text style={styles.sub}>{booked ? 'Booked' : '20 min'}</Text></Pressable>; })}</View>
          {!availableTimes.length ? <Card><Text style={styles.sub}>This teacher is fully booked on the selected day. Choose another date.</Text></Card> : null}
          <Section title="Reason for meeting" />
          <Field label="Questions or context for the teacher" value={reason} onChangeText={setReason} multiline />
        </>
      ) : null}
      {step === 4 ? (
        <>
          <Card style={styles.review}>
            <Pill label={requiresApproval ? 'REQUEST' : 'INSTANT CONFIRMATION'} tone={requiresApproval ? 'yellow' : 'green'} />
            <Text style={styles.reviewTitle}>{subject.name} with {teacher.name}</Text>
            <Text style={styles.reviewLine}>{child.name} · {child.className}</Text>
            <Text style={styles.reviewLine}>{dateOption.label} at {time} · 20 minutes</Text>
            <Text style={styles.reviewLine}>{method === 'video' ? 'Video call' : method === 'phone' ? 'Telephone call' : 'In-person meeting'}</Text>
          </Card>
          <Section title="Meeting reason" />
          <Card><Text style={{ lineHeight: 21 }}>{reason || 'No reason added.'}</Text></Card>
        </>
      ) : null}
      <View style={{ marginTop: 24 }}><Button label={step === 4 ? (existing ? 'Save new appointment time' : 'Confirm appointment') : 'Continue'} loading={saving} disabled={step === 3 && (!reason.trim() || !availableTimes.length || isBooked(time))} onPress={() => step < 4 ? setStep(step + 1) : void confirm()} /></View>
    </Screen>
  );
}

function Choice({ selected, title, subtitle, onPress }: { selected: boolean; title: string; subtitle: string; onPress: () => void }) {
  return <Pressable onPress={onPress}><Card style={[styles.choice, selected && styles.selected]}><View style={{ flex: 1 }}><Text style={styles.choiceTitle}>{title}</Text><Text style={styles.sub}>{subtitle}</Text></View><View style={[styles.radio, selected && styles.radioOn]} /></Card></Pressable>;
}

const styles = StyleSheet.create({
  choiceRow: { gap: 8 },
  choice: { flexDirection: 'row', alignItems: 'center', marginBottom: 9 },
  selected: { borderColor: colors.red, borderWidth: 2, backgroundColor: colors.paleRed },
  choiceTitle: { fontWeight: '900' },
  sub: { color: colors.muted, marginTop: 5, lineHeight: 19 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#B5B5BA' },
  radioOn: { backgroundColor: colors.red, borderColor: colors.red },
  teacherCard: { backgroundColor: colors.black, borderColor: colors.black },
  big: { color: colors.white, fontSize: 24, fontWeight: '900', marginTop: 14 },
  methodTitle: { fontSize: 17, fontWeight: '900' },
  approval: { flexDirection: 'row', alignItems: 'center', marginTop: 18, backgroundColor: colors.white, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.border },
  toggle: { width: 50, height: 30, borderRadius: 15, backgroundColor: '#D5D5D8', padding: 3 },
  toggleOn: { backgroundColor: colors.green },
  knob: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.white },
  knobOn: { marginLeft: 20 },
  dateRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  dateCard: { width: '48.5%', backgroundColor: colors.white, borderRadius: 17, borderWidth: 1, borderColor: colors.border, padding: 14 },
  dateText: { fontWeight: '900' },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  time: { width: '31.5%', backgroundColor: colors.white, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 13, alignItems: 'center' },
  timeText: { fontWeight: '900' },
  unavailable: { opacity: 0.48, backgroundColor: '#ECECEF' },
  review: { backgroundColor: colors.black, borderColor: colors.black },
  reviewTitle: { color: colors.white, fontSize: 23, fontWeight: '900', marginTop: 15 },
  reviewLine: { color: '#D0D0D4', marginTop: 8 },
});
