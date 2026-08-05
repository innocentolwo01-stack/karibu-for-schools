import { useMemo, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  Button,
  Card,
  Field,
  Header,
  Pill,
  Screen,
  Section,
  StepBar,
} from '@/components/ui';
import { appointmentDates, children, subjects, teachers } from '@/data/mock';
import { colors, shadows } from '@/constants/theme';
import { MeetingMethod, useApp } from '@/context/AppContext';

const methods: { id: MeetingMethod; label: string; subtitle: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'video', label: 'Video call', subtitle: 'Join from anywhere', icon: 'videocam-outline' },
  { id: 'phone', label: 'Phone call', subtitle: 'Scheduled call', icon: 'call-outline' },
  { id: 'in-person', label: 'In person', subtitle: 'Meet at school', icon: 'location-outline' },
];

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

  const isBooked = (slot: string) =>
    data.appointments.some(
      item =>
        item.id !== existing?.id &&
        item.teacherId === teacher.id &&
        item.date === date &&
        item.time === slot &&
        item.status !== 'cancelled',
    );

  const availableTimes = dateOption.times.filter(slot => !isBooked(slot));

  const title = useMemo(
    () =>
      step === 1
        ? 'Who would you like to meet?'
        : step === 2
          ? 'Choose how to meet'
          : step === 3
            ? 'Choose a time'
            : 'Review and confirm',
    [step],
  );

  const selectDate = (nextDate: string) => {
    const item = appointmentDates.find(option => option.date === nextDate) ?? appointmentDates[0];
    const firstAvailable = item.times.find(
      slot =>
        !data.appointments.some(
          appointment =>
            appointment.id !== existing?.id &&
            appointment.teacherId === teacher.id &&
            appointment.date === item.date &&
            appointment.time === slot &&
            appointment.status !== 'cancelled',
        ),
    );
    setDate(item.date);
    setTime(firstAvailable ?? item.times[0]);
  };

  const confirm = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 650));

    const patch = {
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
      status: requiresApproval ? ('pending' as const) : ('confirmed' as const),
      meetingLink: method === 'video' ? 'https://meet.google.com/kar-ibu-demo' : undefined,
      phone: method === 'phone' ? '+256 700 123 456' : undefined,
      location: method === 'in-person' ? 'Greenhill Academy · Science Block · Room 12' : undefined,
    };

    if (existing) {
      updateAppointment(existing.id, patch);
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
    <Screen background="warm">
      <Header
        title={existing ? 'Reschedule meeting' : title}
        subtitle={`Step ${step} of 4 · ${child.name}`}
        back
        onBack={() => step > 1 ? setStep(step - 1) : router.back()}
      />
      <StepBar current={step} total={4} />

      {step === 1 ? (
        <>
          <Card style={styles.introCard}>
            <View style={styles.introIcon}><Ionicons name="people" size={26} color={colors.white} /></View>
            <View style={styles.flex}>
              <Text style={styles.introTitle}>Book the right teacher by subject</Text>
              <Text style={styles.introBody}>Karibu automatically routes you to the teacher currently responsible for your child.</Text>
            </View>
          </Card>

          <Section title="Select child" />
          <View style={styles.childGrid}>
            {children.map(item => (
              <Pressable
                key={item.id}
                onPress={() => setChildId(item.id)}
                style={({ pressed }) => [styles.childCard, childId === item.id && styles.selected, pressed && { opacity: 0.72 }]}
              >
                <Text style={styles.childAvatar}>{item.avatar}</Text>
                <Text style={styles.childName}>{item.name}</Text>
                <Text style={styles.childClass}>{item.className} {item.stream}</Text>
                <View style={[styles.radio, childId === item.id && styles.radioActive]}>{childId === item.id ? <View style={styles.radioInner} /> : null}</View>
              </Pressable>
            ))}
          </View>

          <Section title="Select subject" />
          {subjects.map(item => (
            <Choice
              key={item.id}
              selected={subjectId === item.id}
              title={item.name}
              subtitle={item.teacher}
              score={item.score}
              onPress={() => setSubjectId(item.id)}
            />
          ))}
        </>
      ) : null}

      {step === 2 ? (
        <>
          <Card style={styles.teacherHero}>
            <View style={styles.teacherAvatar}><Text style={styles.teacherEmoji}>👩🏾‍🏫</Text></View>
            <View style={styles.teacherCopy}>
              <Pill label="ASSIGNED TEACHER" tone="yellow" />
              <Text style={styles.teacherName}>{teacher.name}</Text>
              <Text style={styles.teacherMeta}>{subject.name} · {child.name}</Text>
            </View>
          </Card>

          <Section title="How would you like to meet?" />
          <View style={styles.methodList}>
            {methods.map(item => {
              const active = method === item.id;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => setMethod(item.id)}
                  style={({ pressed }) => [styles.methodCard, active && styles.methodActive, pressed && { opacity: 0.72 }]}
                >
                  <View style={[styles.methodIcon, active && styles.methodIconActive]}>
                    <Ionicons name={item.icon} size={23} color={active ? colors.white : colors.black} />
                  </View>
                  <View style={styles.flex}>
                    <Text style={styles.methodTitle}>{item.label}</Text>
                    <Text style={styles.methodSub}>{item.subtitle}</Text>
                  </View>
                  <Ionicons name={active ? 'checkmark-circle' : 'ellipse-outline'} size={22} color={active ? colors.red : colors.borderStrong} />
                </Pressable>
              );
            })}
          </View>

          <Card style={styles.methodInfo}>
            <Ionicons
              name={method === 'video' ? 'videocam' : method === 'phone' ? 'call' : 'navigate'}
              size={21}
              color={method === 'video' ? colors.blue : method === 'phone' ? colors.green : colors.red}
            />
            <Text style={styles.methodInfoText}>
              {method === 'video'
                ? 'A secure test meeting link will appear in the confirmation and your calendar.'
                : method === 'phone'
                  ? 'The confirmation shows the call number and who is expected to place the call.'
                  : `Meet at ${teacher.room}. Reception and arrival instructions will be included.`}
            </Text>
          </Card>

          <View style={styles.approval}>
            <View style={styles.flex}>
              <Text style={styles.approvalTitle}>Require teacher approval</Text>
              <Text style={styles.approvalSub}>The request stays pending until the teacher accepts it.</Text>
            </View>
            <Pressable onPress={() => setRequiresApproval(!requiresApproval)} style={[styles.toggle, requiresApproval && styles.toggleOn]}>
              <View style={[styles.knob, requiresApproval && styles.knobOn]} />
            </Pressable>
          </View>
        </>
      ) : null}

      {step === 3 ? (
        <>
          <Card style={styles.calendarHero}>
            <View>
              <Text style={styles.calendarMonth}>AUGUST 2026</Text>
              <Text style={styles.calendarTitle}>Choose a day that works.</Text>
            </View>
            <View style={styles.calendarIcon}><Ionicons name="calendar" size={24} color={colors.white} /></View>
          </Card>

          <Section title="Available dates" />
          <View style={styles.dateRow}>
            {appointmentDates.map(item => {
              const selected = date === item.date;
              const [dayName, dayNumber, monthName] = item.label.split(' ');
              return (
                <Pressable
                  key={item.date}
                  onPress={() => selectDate(item.date)}
                  style={({ pressed }) => [styles.dateCard, selected && styles.dateSelected, pressed && { opacity: 0.72 }]}
                >
                  <Text style={[styles.dayName, selected && { color: colors.white }]}>{dayName}</Text>
                  <Text style={[styles.dayNumber, selected && { color: colors.white }]}>{dayNumber}</Text>
                  <Text style={[styles.monthName, selected && { color: '#FFDDE3' }]}>{monthName}</Text>
                </Pressable>
              );
            })}
          </View>

          <Section title={`${dateOption.label} · Available times`} />
          <View style={styles.timeGrid}>
            {dateOption.times.map(item => {
              const booked = isBooked(item);
              const selected = time === item;
              return (
                <Pressable
                  key={item}
                  disabled={booked}
                  onPress={() => setTime(item)}
                  style={({ pressed }) => [
                    styles.timeCard,
                    selected && styles.timeSelected,
                    booked && styles.timeBooked,
                    pressed && !booked && { opacity: 0.72 },
                  ]}
                >
                  <Text style={[styles.timeText, selected && { color: colors.white }, booked && { color: colors.mutedSoft }]}>{item}</Text>
                  <Text style={[styles.timeMeta, selected && { color: '#FFDDE3' }]}>{booked ? 'Booked' : '20 min'}</Text>
                </Pressable>
              );
            })}
          </View>

          {!availableTimes.length ? (
            <Card style={styles.warningCard}>
              <Ionicons name="information-circle" size={21} color={colors.amber} />
              <Text style={styles.warningText}>This teacher is fully booked on the selected day. Choose another date.</Text>
            </Card>
          ) : null}

          <Section title="Reason for the meeting" />
          <Field label="Questions or context for the teacher" value={reason} onChangeText={setReason} multiline />
        </>
      ) : null}

      {step === 4 ? (
        <>
          <Card style={styles.reviewCard}>
            <View style={styles.reviewTop}>
              <Pill label={requiresApproval ? 'REQUEST' : 'INSTANT CONFIRMATION'} tone={requiresApproval ? 'yellow' : 'green'} />
              <Ionicons name="shield-checkmark" size={24} color={colors.yellow} />
            </View>
            <Text style={styles.reviewTitle}>{subject.name} with {teacher.name}</Text>
            <Text style={styles.reviewMeta}>{child.name} · {child.className}</Text>

            <View style={styles.reviewDivider} />
            <View style={styles.reviewLine}><Text style={styles.reviewKey}>Date</Text><Text style={styles.reviewValue}>{dateOption.label}</Text></View>
            <View style={styles.reviewLine}><Text style={styles.reviewKey}>Time</Text><Text style={styles.reviewValue}>{time} · 20 minutes</Text></View>
            <View style={styles.reviewLine}><Text style={styles.reviewKey}>Type</Text><Text style={styles.reviewValue}>{methods.find(item => item.id === method)?.label}</Text></View>
          </Card>

          <Section title="Meeting reason" />
          <Card><Text style={styles.reasonText}>{reason || 'No reason added.'}</Text></Card>
        </>
      ) : null}

      <View style={styles.footer}>
        <Button
          label={step === 4 ? (existing ? 'Save new meeting time' : 'Confirm appointment') : 'Continue'}
          icon={step === 4 ? 'checkmark' : 'arrow-forward'}
          loading={saving}
          disabled={step === 3 && (!reason.trim() || !availableTimes.length || isBooked(time))}
          onPress={() => step < 4 ? setStep(step + 1) : void confirm()}
        />
      </View>
    </Screen>
  );
}

function Choice({
  selected,
  title,
  subtitle,
  score,
  onPress,
}: {
  selected: boolean;
  title: string;
  subtitle: string;
  score: number;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.choice, selected && styles.selected, pressed && { opacity: 0.72 }]}>
      <View style={styles.subjectIcon}><Text style={styles.subjectIconText}>{title.slice(0, 1)}</Text></View>
      <View style={styles.flex}>
        <Text style={styles.choiceTitle}>{title}</Text>
        <Text style={styles.choiceSub}>{subtitle}</Text>
      </View>
      <View style={styles.score}><Text style={styles.scoreText}>{score}%</Text></View>
      <Ionicons name={selected ? 'checkmark-circle' : 'ellipse-outline'} size={22} color={selected ? colors.red : colors.borderStrong} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  introCard: { backgroundColor: colors.black, flexDirection: 'row', gap: 13, alignItems: 'center' },
  introIcon: { width: 50, height: 50, borderRadius: 18, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center' },
  introTitle: { color: colors.white, fontSize: 16, fontWeight: '900' },
  introBody: { color: '#C8C8CD', fontSize: 11, lineHeight: 17, marginTop: 4 },
  childGrid: { flexDirection: 'row', gap: 9 },
  childCard: { flex: 1, minHeight: 145, borderRadius: 24, backgroundColor: colors.white, padding: 15, ...shadows.soft },
  selected: { backgroundColor: colors.paleRed, borderWidth: 1.5, borderColor: colors.red },
  childAvatar: { fontSize: 37 },
  childName: { fontWeight: '900', fontSize: 14, marginTop: 11 },
  childClass: { color: colors.muted, fontSize: 10, marginTop: 4 },
  radio: { position: 'absolute', right: 13, top: 13, width: 19, height: 19, borderRadius: 10, borderWidth: 1.5, borderColor: colors.borderStrong, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: colors.red },
  radioInner: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.red },
  choice: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 72, backgroundColor: colors.white, borderRadius: 22, padding: 14, marginBottom: 9, ...shadows.soft },
  subjectIcon: { width: 46, height: 46, borderRadius: 16, backgroundColor: colors.paleYellow, alignItems: 'center', justifyContent: 'center' },
  subjectIconText: { fontWeight: '900', fontSize: 18 },
  choiceTitle: { fontWeight: '900', fontSize: 14 },
  choiceSub: { color: colors.muted, fontSize: 11, marginTop: 4 },
  score: { borderRadius: 999, backgroundColor: colors.paleBlue, paddingHorizontal: 9, paddingVertical: 6 },
  scoreText: { color: colors.blue, fontWeight: '900', fontSize: 10 },
  teacherHero: { backgroundColor: colors.black, flexDirection: 'row', alignItems: 'center', gap: 15, padding: 19 },
  teacherAvatar: { width: 74, height: 74, borderRadius: 25, backgroundColor: colors.yellow, alignItems: 'center', justifyContent: 'center' },
  teacherEmoji: { fontSize: 43 },
  teacherCopy: { flex: 1 },
  teacherName: { color: colors.white, fontSize: 24, fontWeight: '900', marginTop: 10 },
  teacherMeta: { color: '#C9C9CE', fontSize: 11, marginTop: 5 },
  methodList: { gap: 9 },
  methodCard: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 76, borderRadius: 22, backgroundColor: colors.white, padding: 14, ...shadows.soft },
  methodActive: { backgroundColor: colors.paleRed, borderWidth: 1.5, borderColor: colors.red },
  methodIcon: { width: 48, height: 48, borderRadius: 17, backgroundColor: colors.paleYellow, alignItems: 'center', justifyContent: 'center' },
  methodIconActive: { backgroundColor: colors.red },
  methodTitle: { fontWeight: '900', fontSize: 14 },
  methodSub: { color: colors.muted, fontSize: 11, marginTop: 4 },
  methodInfo: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginTop: 12 },
  methodInfoText: { flex: 1, color: colors.muted, fontSize: 12, lineHeight: 19 },
  approval: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 15, backgroundColor: colors.white, borderRadius: 22, padding: 16, ...shadows.soft },
  approvalTitle: { fontWeight: '900', fontSize: 13 },
  approvalSub: { color: colors.muted, fontSize: 10, lineHeight: 15, marginTop: 4 },
  toggle: { width: 51, height: 31, borderRadius: 16, backgroundColor: '#D6D6DA', padding: 3 },
  toggleOn: { backgroundColor: colors.green },
  knob: { width: 25, height: 25, borderRadius: 13, backgroundColor: colors.white, ...shadows.hairline },
  knobOn: { marginLeft: 20 },
  calendarHero: { backgroundColor: colors.black, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  calendarMonth: { color: colors.yellow, fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  calendarTitle: { color: colors.white, fontSize: 22, fontWeight: '900', marginTop: 8 },
  calendarIcon: { width: 48, height: 48, borderRadius: 17, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center' },
  dateRow: { flexDirection: 'row', gap: 7 },
  dateCard: { flex: 1, minHeight: 96, borderRadius: 20, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', ...shadows.soft },
  dateSelected: { backgroundColor: colors.red },
  dayName: { color: colors.muted, fontSize: 9, fontWeight: '900', textTransform: 'uppercase' },
  dayNumber: { fontSize: 24, fontWeight: '900', marginTop: 3 },
  monthName: { color: colors.muted, fontSize: 9, marginTop: 2 },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  timeCard: { width: '31.5%', minHeight: 62, borderRadius: 18, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', ...shadows.soft },
  timeSelected: { backgroundColor: colors.red },
  timeBooked: { backgroundColor: '#ECECEF', opacity: 0.58 },
  timeText: { fontWeight: '900', fontSize: 14 },
  timeMeta: { color: colors.muted, fontSize: 9, marginTop: 3 },
  warningCard: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', marginTop: 12, backgroundColor: colors.paleYellow },
  warningText: { flex: 1, color: colors.muted, fontSize: 11, lineHeight: 17 },
  reviewCard: { backgroundColor: colors.black, padding: 20 },
  reviewTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reviewTitle: { color: colors.white, fontSize: 24, lineHeight: 29, fontWeight: '900', marginTop: 17 },
  reviewMeta: { color: '#C9C9CE', marginTop: 7 },
  reviewDivider: { height: 1, backgroundColor: '#343438', marginVertical: 18 },
  reviewLine: { flexDirection: 'row', justifyContent: 'space-between', gap: 20, marginBottom: 11 },
  reviewKey: { color: '#B8B8BE', fontSize: 12 },
  reviewValue: { color: colors.white, fontSize: 12, fontWeight: '800', textAlign: 'right', flex: 1 },
  reasonText: { lineHeight: 21, color: colors.text },
  footer: { marginTop: 26 },
});
