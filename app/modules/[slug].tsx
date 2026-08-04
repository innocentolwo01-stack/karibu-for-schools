import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { Button, Card, Field, Header, Money, Pill, Progress, QrVisual, Row, Screen, Section, Segmented, Stat } from '@/components/ui';
import { colors } from '@/constants/theme';
import { schoolModules } from '@/data/mock';
import { useApp } from '@/context/AppContext';

export default function ModulePage() {
  const { slug = 'transport' } = useLocalSearchParams<{ slug: string }>();
  const module = schoolModules.find(item => item.slug === slug) ?? { slug, title: 'School module', icon: 'apps-outline', summary: 'Interactive module workflow.' };
  return (
    <Screen>
      <Header title={module.title} subtitle={module.summary} back onBack={() => router.back()} />
      <ModuleBody slug={slug} />
    </Screen>
  );
}

function ModuleBody({ slug }: { slug: string }) {
  const { data, setModuleValue } = useApp();
  if (slug === 'transport') return <Transport />;
  if (slug === 'digital-id') return <DigitalId />;
  if (slug === 'visitors') return <Visitors />;
  if (slug === 'cafeteria') return <Cafeteria />;
  if (slug === 'shop') return <Shop />;
  if (slug === 'library') return <Library />;
  if (slug === 'boarding') return <Boarding />;
  if (slug === 'admissions') return <Admissions />;
  if (slug === 'alumni') return <Alumni />;
  if (slug === 'fundraising') return <Fundraising />;
  if (slug === 'integrations') return <Integrations />;
  if (slug === 'government-reporting') return <GovernmentReporting />;
  if (slug === 'examination-boards') return <ExaminationBoards />;
  if (slug === 'school-groups') return <SchoolGroups />;
  if (slug === 'student-transfer') return <StudentTransfer />;
  if (slug === 'nfc-attendance') return <NfcAttendance />;
  if (slug === 'events') return <Events />;
  if (slug === 'ai-support') return <AiSupport />;
  return <Card><Text style={styles.body}>This module is enabled and ready for school-specific configuration.</Text><View style={{ marginTop: 16 }}><Button label="Complete test action" onPress={() => setModuleValue(`completed:${slug}`, true)} /></View>{data.moduleState[`completed:${slug}`] ? <Text style={styles.success}>✓ Test action completed.</Text> : null}</Card>;
}

function Transport() {
  const { data, setModuleValue } = useApp();
  const progress = Number(data.moduleState.transportProgress ?? 42);
  const boarded = Boolean(data.moduleState.transportBoarded);
  return <><View style={styles.grid}><Stat label="Vehicle" value="KFS 024" helper="Driver: Mr Kato" tone="yellow" /><Stat label="ETA" value={`${Math.max(3, 18 - Math.floor(progress / 8))} min`} helper="Kisasi stop" /></View><Section title="Live route" /><Card style={styles.map}><View style={styles.road} /><View style={[styles.bus, { left: `${Math.min(82, progress)}%` }]}><Text>🚌</Text></View><Text style={styles.route}>Greenhill Academy → Ntinda → Bukoto → Kisasi</Text><View style={{ marginTop: 16 }}><Progress value={progress} tone="green" /></View></Card><Section title="Student journey" /><Card style={{ paddingVertical: 2 }}><Row icon="checkmark-circle-outline" title="Amani boarded" subtitle={boarded ? 'Confirmed at 15:42' : 'Awaiting scan'} right={<Pill label={boarded ? 'ON BOARD' : 'WAITING'} tone={boarded ? 'green' : 'yellow'} />} /><Row icon="location-outline" title="Next stop" subtitle="Kisasi Shell Station · approximately 18 minutes" last /></Card><View style={{ marginTop: 18, gap: 9 }}><Button label="Advance simulated vehicle" onPress={() => setModuleValue('transportProgress', progress >= 90 ? 15 : progress + 14)} /><Button label={boarded ? 'Boarding confirmed' : 'Simulate boarding scan'} variant={boarded ? 'green' : 'outline'} onPress={() => setModuleValue('transportBoarded', true)} /></View></>;
}

function DigitalId() {
  const { data, setModuleValue } = useApp();
  const token = String(data.moduleState.digitalIdToken ?? 'KFS-ID-IA9TDJM');
  return <><Card style={styles.idCard}><View><Text style={styles.idSchool}>GREENHILL ACADEMY</Text><Text style={styles.idName}>Amani Olwo</Text><Text style={styles.idMeta}>Senior 3 Blue · IA9TDJM</Text><Pill label="ACTIVE" tone="green" /></View><View style={styles.photo}><Text style={{ fontSize: 44 }}>👦🏾</Text></View></Card><Section title="Student QR identity" /><View style={{ alignItems: 'center' }}><QrVisual token={token} size={235} /><Text style={styles.token}>{token}</Text></View><Card style={{ marginTop: 15, paddingVertical: 2 }}><Row icon="school-outline" title="Campus access" subtitle="Greenhill main campus" right={<Pill label="ALLOWED" tone="green" />} /><Row icon="library-outline" title="Library and cafeteria" subtitle="QR enabled" right={<Pill label="ENABLED" tone="blue" />} /><Row icon="radio-outline" title="NFC readiness" subtitle="Can be provisioned to a supported card" right={<Pill label="FUTURE" tone="yellow" />} last /></Card><View style={{ marginTop: 18 }}><Button label="Refresh digital ID" variant="outline" onPress={() => setModuleValue('digitalIdToken', `KFS-ID-${Date.now().toString().slice(-6)}`)} /></View></>;
}

function Visitors() {
  const { data, setModuleValue } = useApp();
  const [name, setName] = useState('Sarah Nsubuga');
  const [reason, setReason] = useState('Parent-teacher appointment');
  const registered = Boolean(data.moduleState.visitorRegistered);
  return <>{registered ? <><Card style={styles.confirm}><Pill label="VISITOR PASS ACTIVE" tone="green" /><Text style={styles.bigTitle}>{name}</Text><Text style={styles.body}>Greenhill Academy · Reception check-in · 11 August at 14:45</Text></Card><View style={{ alignItems: 'center', marginTop: 18 }}><QrVisual token="VISITOR-KFS-2026" size={230} /></View><View style={{ marginTop: 18 }}><Button label="Check visitor out" variant="outline" onPress={() => setModuleValue('visitorRegistered', false)} /></View></> : <><Section title="Pre-register visitor" /><Field label="Visitor name" value={name} onChangeText={setName} /><Field label="Reason for visit" value={reason} onChangeText={setReason} /><Card style={{ paddingVertical: 2 }}><Row icon="person-outline" title="Host" subtitle="Mrs Nakato · Biology" /><Row icon="calendar-outline" title="Arrival" subtitle="11 August · 14:45" /><Row icon="location-outline" title="Check-in" subtitle="Main reception" last /></Card><View style={{ marginTop: 18 }}><Button label="Create visitor QR pass" disabled={!name.trim() || !reason.trim()} onPress={() => setModuleValue('visitorRegistered', true)} /></View></>}</>;
}

function Cafeteria() {
  const { data, setModuleValue, createPayment } = useApp();
  const balance = Number(data.moduleState.cafeteriaBalance ?? 35000);
  const [menu, setMenu] = useState<'today' | 'week'>('today');
  const [notice, setNotice] = useState('');

  const buyLunch = () => {
    if (balance < 8000) return;
    setModuleValue('cafeteriaBalance', balance - 8000);
    setNotice('Lunch purchased. Amani can collect it using the student QR ID.');
  };

  const topUp = async () => {
    const payment = await createPayment({
      title: 'Cafeteria balance top-up',
      amount: 20000,
      method: 'MTN Mobile Money · Sandbox',
      status: 'successful',
      category: 'cafeteria',
    });
    setModuleValue('cafeteriaBalance', balance + 20000);
    router.push(`/parent/payment-receipt/${payment.id}` as never);
  };

  return <>
    <Card style={styles.wallet}>
      <Text style={styles.walletLabel}>Meal balance</Text>
      <Money value={balance} style={styles.walletValue} />
      <Text style={styles.walletSub}>Daily spending limit: UGX 15,000</Text>
    </Card>
    <View style={{ marginTop: 14 }}>
      <Segmented value={menu} onChange={setMenu} options={[{ value: 'today', label: "Today's menu" }, { value: 'week', label: 'Weekly menu' }]} />
    </View>
    <Section title={menu === 'today' ? 'Tuesday menu' : 'This week'} />
    <Card style={{ paddingVertical: 2 }}>
      <Row icon="restaurant-outline" title="Matooke, rice and beef stew" subtitle="UGX 8,000 · Available" right={<Pill label="LUNCH" tone="green" />} />
      <Row icon="cafe-outline" title="Fruit and yoghurt" subtitle="UGX 4,000 · Available" right={<Pill label="SNACK" tone="yellow" />} last />
    </Card>
    {notice ? <Card style={styles.noticeCard}><Text style={styles.noticeText}>✓ {notice}</Text></Card> : null}
    <View style={{ marginTop: 18, gap: 9 }}>
      <Button label="Buy test lunch · UGX 8,000" disabled={balance < 8000} onPress={buyLunch} />
      <Button label="Top up UGX 20,000" variant="outline" onPress={() => void topUp()} />
    </View>
    <Section title="Dietary information" />
    <Card><Text style={styles.body}>No recorded allergies. Parent meal preferences: balanced meal, no energy drinks.</Text></Card>
  </>;
}

function Shop() {
  const { data, setModuleValue, createPayment } = useApp();
  const cart = Number(data.moduleState.shopCart ?? 0);
  const total = Number(data.moduleState.shopCartTotal ?? 0);
  const ordered = Boolean(data.moduleState.shopOrderPlaced);
  const products = [
    { title: 'Senior school shirt', amount: 45000, emoji: '👕' },
    { title: 'Black school trousers', amount: 65000, emoji: '👖' },
    { title: 'Mathematics exercise book', amount: 8000, emoji: '📓' },
  ];

  const addProduct = (amount: number) => {
    setModuleValue('shopCart', cart + 1);
    setModuleValue('shopCartTotal', total + amount);
    setModuleValue('shopOrderPlaced', false);
  };

  const placeOrder = async () => {
    const payment = await createPayment({
      title: 'Greenhill school-shop order',
      amount: total,
      method: 'Visa ending 4242 · Sandbox',
      status: 'successful',
      category: 'shop',
    });
    setModuleValue('shopOrderPlaced', true);
    setModuleValue('shopCart', 0);
    setModuleValue('shopCartTotal', 0);
    router.push(`/parent/payment-receipt/${payment.id}` as never);
  };

  return <>
    <Card style={styles.shopHero}>
      <Pill label="TERM 2 SHOP" tone="yellow" />
      <Text style={styles.bigTitle}>Uniforms, books and stationery</Text>
      <Text style={styles.darkBody}>Choose products, complete a sandbox payment and collect the order from school.</Text>
    </Card>
    <Section title="Products" />
    {products.map(product => (
      <Pressable key={product.title} onPress={() => addProduct(product.amount)}>
        <Card style={styles.product}>
          <View style={styles.productImage}><Text style={{ fontSize: 30 }}>{product.emoji}</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.itemTitle}>{product.title}</Text>
            <Text style={styles.body}>UGX {product.amount.toLocaleString('en-GB')} · In stock</Text>
          </View>
          <Pill label="ADD" tone="red" />
        </Card>
      </Pressable>
    ))}
    <Card style={{ marginTop: 13 }}>
      <Text style={styles.itemTitle}>Basket · {cart} item{cart === 1 ? '' : 's'}</Text>
      <Money value={total} style={styles.basketTotal} />
      <Text style={styles.body}>{ordered ? 'Order confirmed and ready for processing.' : 'Collection: Main school shop'}</Text>
    </Card>
    <View style={{ marginTop: 18, gap: 9 }}>
      <Button label={ordered ? 'Order placed successfully' : 'Pay and place sandbox order'} disabled={!cart || ordered} onPress={() => void placeOrder()} />
      {cart > 0 ? <Button label="Clear basket" variant="outline" onPress={() => { setModuleValue('shopCart', 0); setModuleValue('shopCartTotal', 0); }} /> : null}
    </View>
  </>;
}

function Library() {
  const { data, setModuleValue } = useApp();
  const [query, setQuery] = useState('Things Fall Apart');
  const reserved = Boolean(data.moduleState.libraryReserved);
  const renewed = Boolean(data.moduleState.libraryRenewed);
  const matches = query.trim().length === 0 || 'Things Fall Apart Chinua Achebe'.toLowerCase().includes(query.toLowerCase());
  return <>
    <Field label="Search catalogue" value={query} onChangeText={setQuery} placeholder="Book title, author or ISBN" />
    {matches ? <Card style={styles.book}>
      <View style={styles.cover}><Text style={{ fontSize: 38 }}>📕</Text></View>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemTitle}>Things Fall Apart</Text>
        <Text style={styles.body}>Chinua Achebe · 2 copies available</Text>
        <Pill label={reserved ? 'RESERVED' : 'AVAILABLE'} tone={reserved ? 'blue' : 'green'} />
      </View>
    </Card> : <Card><Text style={styles.body}>No books matched “{query}”. Try another title or author.</Text></Card>}
    {matches ? <View style={{ marginTop: 14 }}><Button label={reserved ? 'Reservation confirmed' : 'Reserve book'} disabled={reserved} onPress={() => setModuleValue('libraryReserved', true)} /></View> : null}
    <Section title="Current loan" />
    <Card>
      <Text style={styles.itemTitle}>Long Walk to Freedom</Text>
      <Text style={styles.body}>Due 12 August · Loan barcode KFS-LIB-1142</Text>
      <View style={{ marginTop: 14 }}><Button label={renewed ? 'Renewed to 26 August' : 'Renew loan'} variant={renewed ? 'green' : 'outline'} disabled={renewed} onPress={() => setModuleValue('libraryRenewed', true)} /></View>
    </Card>
  </>;
}

function Boarding() {
  const { data, setModuleValue, addNotification } = useApp();
  const requested = Boolean(data.moduleState.boardingLeaveRequested);
  const submitLeave = () => {
    setModuleValue('boardingLeaveRequested', true);
    addNotification({ role: 'parent', title: 'Boarding leave request sent', body: 'Saturday, 15 August · 09:00–18:00', route: '/modules/boarding' });
  };
  return <>
    <View style={styles.grid}><Stat label="House" value="Rwenzori" helper="Room B14" tone="yellow" /><Stat label="Evening roll call" value="Present" helper="Recorded 20:03" /></View>
    <Section title="Boarding profile" />
    <Card style={{ paddingVertical: 2 }}>
      <Row icon="bed-outline" title="Room allocation" subtitle="Rwenzori House · Room B14 · Bed 3" />
      <Row icon="restaurant-outline" title="Meals" subtitle="Standard boarding meal plan" />
      <Row icon="medical-outline" title="Medical note" subtitle="No active boarding restrictions" last />
    </Card>
    <Section title="Weekend leave request" />
    <Card>
      <Text style={styles.itemTitle}>Saturday, 15 August · 09:00–18:00</Text>
      <Text style={styles.body}>Collection by authorised guardian: Innocent Olwo</Text>
      <View style={{ marginTop: 15 }}><Button label={requested ? 'Leave request sent' : 'Submit leave request'} variant={requested ? 'green' : 'red'} disabled={requested} onPress={submitLeave} /></View>
    </Card>
  </>;
}

function Admissions() {
  const { data, setModuleValue, createPayment } = useApp();
  const [name, setName] = useState('Noah Olwo');
  const [year, setYear] = useState('Primary 1 · 2027 intake');
  const submitted = Boolean(data.moduleState.admissionSubmitted);
  const submitApplication = async () => {
    const payment = await createPayment({
      title: 'School admission application fee',
      amount: 50000,
      method: 'Airtel Money · Sandbox',
      status: 'successful',
      category: 'admission',
    });
    setModuleValue('admissionSubmitted', true);
    setModuleValue('admissionApplicant', name);
    router.push(`/parent/payment-receipt/${payment.id}` as never);
  };
  return <>{submitted ? <Card style={styles.confirm}>
    <Pill label="APPLICATION SUBMITTED" tone="green" />
    <Text style={styles.bigTitle}>{String(data.moduleState.admissionApplicant ?? name)}</Text>
    <Text style={styles.darkBody}>Reference KFS-ADM-2027-0142 · Application fee paid · Document review in progress.</Text>
    <View style={{ marginTop: 15 }}><Button label="Book admission interview" variant="yellow" onPress={() => router.push('/parent/book-appointment')} /></View>
  </Card> : <>
    <Section title="New sibling application" />
    <Field label="Applicant name" value={name} onChangeText={setName} />
    <Field label="Entry year" value={year} onChangeText={setYear} />
    <Card style={{ paddingVertical: 2 }}>
      <Row icon="document-attach-outline" title="Birth certificate" subtitle="Test document attached" right={<Pill label="READY" tone="green" />} />
      <Row icon="document-attach-outline" title="Previous school report" subtitle="Test document attached" right={<Pill label="READY" tone="green" />} />
      <Row icon="card-outline" title="Application fee" subtitle="UGX 50,000 sandbox fee" right={<Pill label="DUE" tone="yellow" />} last />
    </Card>
    <View style={{ marginTop: 18 }}><Button label="Pay fee and submit application" disabled={!name.trim() || !year.trim()} onPress={() => void submitApplication()} /></View>
  </>}</>;
}

function Alumni() {
  const { data, setModuleValue } = useApp();
  const registered = Boolean(data.moduleState.alumniRegistered);
  return <>
    <Card style={styles.shopHero}><Pill label="ALUMNI NETWORK" tone="purple" /><Text style={styles.bigTitle}>Stay connected after school</Text><Text style={styles.darkBody}>Events, mentoring, career opportunities, school news and fundraising.</Text></Card>
    <Section title="Alumni profile" />
    <Card style={{ paddingVertical: 2 }}><Row icon="school-outline" title="Graduation year" subtitle="2012" /><Row icon="briefcase-outline" title="Career" subtitle="Technology and product development" /><Row icon="people-outline" title="Mentoring interest" subtitle="Student careers and entrepreneurship" last /></Card>
    <View style={{ marginTop: 18 }}><Button label={registered ? 'Alumni profile active' : 'Join alumni network'} variant={registered ? 'green' : 'red'} disabled={registered} onPress={() => setModuleValue('alumniRegistered', true)} /></View>
    <Section title="Upcoming event" /><Card><Text style={styles.itemTitle}>Founders and Alumni Evening</Text><Text style={styles.body}>Friday, 6 November · Main Hall · 18:00</Text></Card>
  </>;
}

function Fundraising() {
  const { data, setModuleValue, createPayment } = useApp();
  const raised = Number(data.moduleState.fundraisingRaised ?? 42500000);
  const [amount, setAmount] = useState('100000');
  const donate = async () => {
    const donation = Number(amount);
    if (!donation) return;
    const payment = await createPayment({
      title: 'Science laboratory donation',
      amount: donation,
      method: 'Visa ending 4242 · Sandbox',
      status: 'successful',
      category: 'donation',
    });
    setModuleValue('fundraisingRaised', raised + donation);
    router.push(`/parent/payment-receipt/${payment.id}` as never);
  };
  return <>
    <Card style={styles.shopHero}>
      <Pill label="ACTIVE CAMPAIGN" tone="yellow" />
      <Text style={styles.bigTitle}>New science laboratory</Text>
      <Text style={styles.darkBody}>Help equip a modern practical science space for students.</Text>
      <Money value={raised} style={styles.donationTotal} />
      <Text style={styles.darkBody}>of UGX 80,000,000 target</Text>
      <View style={{ marginTop: 14 }}><Progress value={(raised / 80000000) * 100} tone="green" /></View>
    </Card>
    <Section title="Make a sandbox donation" />
    <Field label="Donation amount (UGX)" value={amount} onChangeText={value => setAmount(value.replace(/[^0-9]/g, ''))} keyboardType="number-pad" />
    <Button label={`Donate UGX ${Number(amount || 0).toLocaleString('en-GB')}`} disabled={!Number(amount)} onPress={() => void donate()} />
    <Section title="Recent supporters" />
    <Card style={{ paddingVertical: 2 }}><Row title="Anonymous parent" subtitle="UGX 500,000" /><Row title="Class of 2012" subtitle="UGX 2,500,000" /><Row title="Karibu community" subtitle="UGX 1,000,000" last /></Card>
  </>;
}

function Integrations() {
  const { data, setModuleValue } = useApp();
  const google = Boolean(data.moduleState.googleConnected);
  const microsoft = Boolean(data.moduleState.microsoftConnected);
  return <><Card style={styles.shopHero}><Pill label="INTEGRATION CENTRE" tone="blue" /><Text style={styles.bigTitle}>Connect existing school systems</Text><Text style={styles.body}>The test toggles model secure provider connections. Live synchronisation requires each school's credentials and approval.</Text></Card><Section title="Learning platforms" /><Card style={{ paddingVertical: 2 }}><Row icon="logo-google" title="Google Classroom and Calendar" subtitle={google ? 'Connected to Greenhill demo workspace' : 'Not connected'} right={<Switch value={google} onValueChange={value => setModuleValue('googleConnected', value)} trackColor={{ true: colors.green }} />} /><Row icon="logo-microsoft" title="Microsoft Education and Teams" subtitle={microsoft ? 'Connected to Greenhill demo tenant' : 'Not connected'} right={<Switch value={microsoft} onValueChange={value => setModuleValue('microsoftConnected', value)} trackColor={{ true: colors.green }} />} /><Row icon="videocam-outline" title="Zoom meeting adapter" subtitle="Ready for provider credentials" right={<Pill label="READY" tone="yellow" />} last /></Card><Section title="Data connections" /><Card style={{ paddingVertical: 2 }}><Row icon="server-outline" title="Learning management system" subtitle="OneRoster-style data adapter" /><Row icon="chatbubble-outline" title="SMS and email provider" subtitle="Notification delivery adapter" /><Row icon="card-outline" title="Karibu Payments" subtitle="Reserved for later production connection" last /></Card></>;
}

function GovernmentReporting() {
  const { data, setModuleValue } = useApp();
  const generated = Boolean(data.moduleState.governmentReportGenerated);
  return <><Card style={styles.shopHero}><Pill label="VALIDATED EXPORT" tone="green" /><Text style={styles.bigTitle}>Government education reporting</Text><Text style={styles.body}>Prepare enrolment, attendance and school-statistics reports with validation before submission.</Text></Card><Section title="August report" /><Card style={{ paddingVertical: 2 }}><Row title="Student enrolment" subtitle="842 records · Valid" right={<Pill label="VALID" tone="green" />} /><Row title="Attendance summary" subtitle="4 records require review" right={<Pill label="REVIEW" tone="yellow" />} /><Row title="Staff information" subtitle="68 records · Valid" right={<Pill label="VALID" tone="green" />} last /></Card><View style={{ marginTop: 18 }}><Button label={generated ? 'Report package generated' : 'Generate test report package'} variant={generated ? 'green' : 'red'} disabled={generated} onPress={() => setModuleValue('governmentReportGenerated', true)} /></View></>;
}

function ExaminationBoards() {
  const { data, setModuleValue } = useApp();
  const submitted = Boolean(data.moduleState.examEntriesSubmitted);
  return <><View style={styles.grid}><Stat label="Candidates" value="112" helper="Senior 4" /><Stat label="Validation" value="110/112" helper="2 need review" tone="yellow" /></View><Section title="Candidate entry checks" /><Card style={{ paddingVertical: 2 }}><Row title="Candidate identities" subtitle="112 records matched" right={<Pill label="VALID" tone="green" />} /><Row title="Subject selections" subtitle="2 missing subject codes" right={<Pill label="REVIEW" tone="yellow" />} /><Row title="Exam fee reconciliation" subtitle="UGX 8,960,000 recorded" right={<Pill label="READY" tone="blue" />} last /></Card><View style={{ marginTop: 18 }}><Button label={submitted ? 'Test entries submitted' : 'Submit validated test entries'} disabled={submitted} variant={submitted ? 'green' : 'red'} onPress={() => setModuleValue('examEntriesSubmitted', true)} /></View></>;
}

function SchoolGroups() {
  const { data, setModuleValue } = useApp();
  const campus = String(data.moduleState.activeCampus ?? 'Greenhill Main Campus');
  return <><Card style={styles.shopHero}><Pill label="SCHOOL GROUP" tone="purple" /><Text style={styles.bigTitle}>Greenhill Education Group</Text><Text style={styles.body}>Shared reporting with school-specific permissions, branding and operations.</Text></Card><Section title="Campuses" />{['Greenhill Main Campus','Greenhill Primary Campus','Greenhill Entebbe Campus'].map(item => <Pressable key={item} onPress={() => setModuleValue('activeCampus', item)}><Card style={[styles.campus, campus === item && styles.selected]}><View style={{ flex: 1 }}><Text style={styles.itemTitle}>{item}</Text><Text style={styles.body}>{item === 'Greenhill Main Campus' ? '842 students · 68 staff' : '420 students · 34 staff'}</Text></View><Pill label={campus === item ? 'ACTIVE' : 'OPEN'} tone={campus === item ? 'red' : 'black'} /></Card></Pressable>)}<Section title="Group controls" /><Card style={{ paddingVertical: 2 }}><Row icon="people-outline" title="Shared staff" subtitle="12 staff work across campuses" /><Row icon="stats-chart-outline" title="Central reporting" subtitle="Consolidated group dashboard" /><Row icon="shield-checkmark-outline" title="School-specific permissions" subtitle="Enabled" last /></Card></>;
}

function StudentTransfer() {
  const { data, setModuleValue } = useApp();
  const sent = Boolean(data.moduleState.transferRequested);
  const [destination, setDestination] = useState('Greenhill Entebbe Campus');
  return <>{sent ? <Card style={styles.confirm}><Pill label="TRANSFER REQUEST SENT" tone="green" /><Text style={styles.bigTitle}>Amani Olwo</Text><Text style={styles.body}>Destination: {destination} · Academic and safeguarding record pack awaiting school approval.</Text></Card> : <><Section title="Request transfer" /><Field label="Destination school" value={destination} onChangeText={setDestination} /><Card style={{ paddingVertical: 2 }}><Row icon="document-text-outline" title="Academic history" subtitle="Included" right={<Pill label="READY" tone="green" />} /><Row icon="calendar-outline" title="Attendance history" subtitle="Included" right={<Pill label="READY" tone="green" />} /><Row icon="card-outline" title="Financial clearance" subtitle="Outstanding balance requires handling" right={<Pill label="REVIEW" tone="yellow" />} last /></Card><View style={{ marginTop: 18 }}><Button label="Send transfer request" disabled={!destination.trim()} onPress={() => setModuleValue('transferRequested', true)} /></View></>}</>;
}

function NfcAttendance() {
  const { data, setModuleValue } = useApp();
  const tapped = Boolean(data.moduleState.nfcTapped);
  return <><Card style={styles.nfc}><Text style={styles.nfcIcon}>◉</Text><Text style={styles.bigTitle}>Tap student or staff ID</Text><Text style={styles.body}>NFC uses the same attendance event and audit architecture as QR and manual registers.</Text></Card><Section title="Test NFC reader" /><Button label={tapped ? 'Attendance recorded by NFC' : 'Simulate NFC attendance tap'} variant={tapped ? 'green' : 'black'} disabled={tapped} onPress={() => setModuleValue('nfcTapped', true)} />{tapped ? <Card style={{ backgroundColor: colors.paleGreen, marginTop: 12 }}><Text style={{ color: colors.green, fontWeight: '900' }}>✓ Amani Olwo · Gate arrival · 08:02 · NFC</Text></Card> : null}<Section title="Compatible use cases" /><Card style={{ paddingVertical: 2 }}><Row title="School gate arrival and departure" /><Row title="Classroom lesson attendance" /><Row title="Transport boarding" /><Row title="Library and cafeteria identification" last /></Card></>;
}

function Events() {
  const { data, setModuleValue } = useApp();
  const joined = Boolean(data.moduleState.eventJoined);
  return <><Card style={styles.shopHero}><Pill label="UPCOMING EVENT" tone="yellow" /><Text style={styles.bigTitle}>School sports day</Text><Text style={styles.body}>Saturday, 22 August · Main sports field · 08:00–16:00</Text></Card><Section title="Participation" /><Card style={{ paddingVertical: 2 }}><Row icon="football-outline" title="Senior boys football" subtitle="Amani is eligible" /><Row icon="walk-outline" title="Family fun walk" subtitle="Parents and guardians welcome" /><Row icon="restaurant-outline" title="Meal vouchers" subtitle="Available through cafeteria balance" last /></Card><View style={{ marginTop: 18 }}><Button label={joined ? 'Participation confirmed' : 'Confirm participation'} variant={joined ? 'green' : 'red'} disabled={joined} onPress={() => setModuleValue('eventJoined', true)} /></View></>;
}

function AiSupport() {
  const { data, setModuleValue } = useApp();
  const generated = Boolean(data.moduleState.aiDraftGenerated);
  const approved = Boolean(data.moduleState.aiDraftApproved);
  return <><Card style={styles.shopHero}><Pill label="HUMAN REVIEW REQUIRED" tone="yellow" /><Text style={styles.bigTitle}>AI-assisted school support</Text><Text style={styles.body}>Draft lesson plans, report comments and summaries. Nothing is published without authorised human review.</Text></Card><Section title="Report comment assistant" />{generated ? <Card><Text style={styles.itemTitle}>Draft for Amani Olwo · Biology</Text><Text style={styles.aiDraft}>Amani demonstrates a sound understanding of core Biology concepts and contributes confidently during practical work. The next priority is completing written explanations with greater detail and consistency.</Text><Pill label={approved ? 'APPROVED' : 'DRAFT · NOT PUBLISHED'} tone={approved ? 'green' : 'yellow'} /></Card> : <Card><Text style={styles.body}>Generate a draft from test performance, attendance and assignment data.</Text></Card>}<View style={{ marginTop: 16, gap: 9 }}><Button label={generated ? 'Regenerate draft' : 'Generate draft'} onPress={() => { setModuleValue('aiDraftGenerated', true); setModuleValue('aiDraftApproved', false); }} /><Button label={approved ? 'Approved by teacher' : 'Review and approve'} variant={approved ? 'green' : 'outline'} disabled={!generated || approved} onPress={() => setModuleValue('aiDraftApproved', true)} /></View><Section title="Other assistants" /><Card style={{ paddingVertical: 2 }}><Row title="Lesson-plan draft" subtitle="Curriculum objective and resource suggestions" /><Row title="Parent-message draft" subtitle="Tone-controlled communication" /><Row title="Data quality checks" subtitle="Missing and inconsistent school records" last /></Card></>;
}

const styles = StyleSheet.create({
  body: { color: colors.muted, lineHeight: 21, marginTop: 6 }, darkBody: { color: '#D9D9DE', lineHeight: 21, marginTop: 7 }, success: { color: colors.green, fontWeight: '900', marginTop: 15 }, grid: { flexDirection: 'row', gap: 10 },
  map: { minHeight: 190, backgroundColor: colors.paleBlue, overflow: 'hidden' }, road: { height: 13, borderRadius: 8, backgroundColor: '#B9BEC8', marginTop: 55 }, bus: { position: 'absolute', top: 43, width: 42, height: 42, borderRadius: 14, backgroundColor: colors.yellow, alignItems: 'center', justifyContent: 'center' }, route: { color: colors.muted, lineHeight: 20, marginTop: 50 },
  idCard: { backgroundColor: colors.black, borderColor: colors.black, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, idSchool: { color: colors.yellow, fontSize: 11, fontWeight: '900', letterSpacing: 1 }, idName: { color: colors.white, fontSize: 24, fontWeight: '900', marginTop: 12 }, idMeta: { color: '#CFCFD2', marginTop: 6, marginBottom: 13 }, photo: { width: 82, height: 82, borderRadius: 25, backgroundColor: colors.yellow, alignItems: 'center', justifyContent: 'center' }, token: { fontWeight: '900', letterSpacing: 1.5, marginTop: 12 },
  confirm: { backgroundColor: colors.black, borderColor: colors.black }, bigTitle: { fontSize: 23, lineHeight: 28, fontWeight: '900', marginTop: 14, color: colors.white },
  wallet: { backgroundColor: colors.black, borderColor: colors.black }, walletLabel: { color: '#CFCFD2' }, walletValue: { color: colors.yellow, fontSize: 38, fontWeight: '900', marginTop: 8 }, walletSub: { color: '#CFCFD2', marginTop: 6 },
  shopHero: { backgroundColor: colors.black, borderColor: colors.black }, basketTotal: { fontSize: 25, fontWeight: '900', marginTop: 8 }, noticeCard: { backgroundColor: colors.paleGreen, borderColor: '#BDE8CC', marginTop: 12 }, noticeText: { color: colors.green, fontWeight: '900', lineHeight: 20 }, product: { flexDirection: 'row', alignItems: 'center', gap: 11, marginBottom: 8 }, productImage: { width: 55, height: 55, borderRadius: 18, backgroundColor: colors.paleYellow, alignItems: 'center', justifyContent: 'center' }, itemTitle: { fontWeight: '900', fontSize: 16 },
  book: { flexDirection: 'row', gap: 13, alignItems: 'center' }, cover: { width: 72, height: 96, borderRadius: 14, backgroundColor: colors.paleRed, alignItems: 'center', justifyContent: 'center' }, donationTotal: { color: colors.yellow, fontSize: 34, fontWeight: '900', marginTop: 18 },
  campus: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 }, selected: { borderColor: colors.red, borderWidth: 2, backgroundColor: colors.paleRed },
  nfc: { alignItems: 'center', padding: 25, backgroundColor: colors.black, borderColor: colors.black }, nfcIcon: { color: colors.yellow, fontSize: 86 }, aiDraft: { lineHeight: 22, marginVertical: 13, fontWeight: '700' },
});
