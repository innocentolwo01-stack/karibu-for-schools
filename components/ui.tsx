import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, shadows } from '@/constants/theme';

export function Screen({ children, scroll = true, style }: { children: React.ReactNode; scroll?: boolean; style?: ViewStyle }) {
  const body = scroll ? (
    <ScrollView
      contentContainerStyle={[styles.content, style]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, { flex: 1 }, style]}>{children}</View>
  );
  return <SafeAreaView style={styles.safe}>{body}</SafeAreaView>;
}

export function Logo({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <View style={styles.logoRow}>
      <View style={[styles.logoBox, compact && styles.logoBoxCompact]}>
        <Text style={[styles.logoK, compact && styles.logoKCompact]}>K</Text>
      </View>
      <View>
        <Text style={[styles.logoName, { color: light ? colors.white : colors.black }, compact && styles.logoNameCompact]}>Karibu</Text>
        <Text style={styles.logoSub}>FOR SCHOOLS</Text>
      </View>
    </View>
  );
}

export function Header({ title, subtitle, back, onBack, right }: { title: string; subtitle?: string; back?: boolean; onBack?: () => void; right?: React.ReactNode }) {
  return (
    <View style={styles.header}>
      {back ? (
        <Pressable onPress={onBack} style={({ pressed }: { pressed: boolean }) => [styles.back, pressed && styles.pressed]}>
          <Ionicons name="arrow-back" size={23} />
        </Pressable>
      ) : null}
      <View style={{ flex: 1 }}>
        <Text style={styles.headerTitle}>{title}</Text>
        {subtitle ? <Text style={styles.headerSub}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

export function IconButton({ icon, onPress, badge }: { icon: keyof typeof Ionicons.glyphMap; onPress: () => void; badge?: number }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }: { pressed: boolean }) => [styles.iconButton, pressed && styles.pressed]}>
      <Ionicons name={icon} size={23} color={colors.black} />
      {badge ? (
        <View style={styles.iconBadge}>
          <Text style={styles.iconBadgeText}>{badge > 9 ? '9+' : badge}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Button({
  label,
  onPress,
  variant = 'red',
  disabled = false,
  loading = false,
  icon,
}: {
  label: string;
  onPress?: () => void;
  variant?: 'red' | 'black' | 'outline' | 'yellow' | 'green';
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  const bg = variant === 'red' ? colors.red : variant === 'black' ? colors.black : variant === 'yellow' ? colors.yellow : variant === 'green' ? colors.green : colors.white;
  const fg = variant === 'yellow' || variant === 'outline' ? colors.black : colors.white;
  return (
    <Pressable
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }: { pressed: boolean }) => [
        styles.button,
        {
          backgroundColor: bg,
          borderWidth: variant === 'outline' ? 1 : 0,
          borderColor: colors.border,
          opacity: disabled ? 0.45 : pressed ? 0.82 : 1,
        },
      ]}
    >
      {loading ? <ActivityIndicator color={fg} /> : (
        <View style={styles.buttonInner}>
          {icon ? <Ionicons name={icon} size={19} color={fg} /> : null}
          <Text style={[styles.buttonText, { color: fg }]}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
}

export function Section({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? <Text onPress={onAction} style={styles.action}>{action}</Text> : null}
    </View>
  );
}

export function Row({ icon, title, subtitle, onPress, right, last = false }: { icon?: keyof typeof Ionicons.glyphMap; title: string; subtitle?: string; onPress?: () => void; right?: React.ReactNode; last?: boolean }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }: { pressed: boolean }) => [styles.row, last && { borderBottomWidth: 0 }, pressed && onPress ? styles.pressed : null]}>
      {icon ? (
        <View style={styles.rowIcon}>
          <Ionicons name={icon} size={22} color={colors.black} />
        </View>
      ) : null}
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        {subtitle ? <Text style={styles.rowSub}>{subtitle}</Text> : null}
      </View>
      {right ?? (onPress ? <Ionicons name="chevron-forward" size={20} color={colors.muted} /> : null)}
    </Pressable>
  );
}

export function Pill({ label, tone = 'green' }: { label: string; tone?: 'green' | 'red' | 'yellow' | 'black' | 'blue' | 'purple' }) {
  const bg = tone === 'green' ? colors.paleGreen : tone === 'red' ? colors.paleRed : tone === 'yellow' ? colors.paleYellow : tone === 'blue' ? colors.paleBlue : tone === 'purple' ? colors.palePurple : '#ECECEF';
  const fg = tone === 'green' ? colors.green : tone === 'red' ? colors.red : tone === 'yellow' ? colors.amber : tone === 'blue' ? colors.blue : tone === 'purple' ? colors.purple : colors.black;
  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <Text style={{ color: fg, fontSize: 11, fontWeight: '900' }}>{label}</Text>
    </View>
  );
}

export function Money({ value, style }: { value: number; style?: StyleProp<TextStyle> }) {
  return <Text style={style}>UGX {value.toLocaleString('en-GB')}</Text>;
}

export function Stat({ label, value, helper, tone = 'white' }: { label: string; value: string; helper: string; tone?: 'white' | 'black' | 'yellow' }) {
  const dark = tone === 'black';
  return (
    <Card style={[styles.stat, dark ? styles.statBlack : tone === 'yellow' ? styles.statYellow : null]}>
      <Text style={[styles.statLabel, dark && { color: '#CFCFD2' }]}>{label}</Text>
      <Text style={[styles.statValue, dark && { color: colors.white }]}>{value}</Text>
      <Text style={[styles.statHelper, dark && { color: '#CFCFD2' }]}>{helper}</Text>
    </Card>
  );
}

export function Progress({ value, tone = 'red' }: { value: number; tone?: 'red' | 'green' | 'blue' }) {
  const fill = tone === 'green' ? colors.green : tone === 'blue' ? colors.blue : colors.red;
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${Math.max(0, Math.min(100, value))}%`, backgroundColor: fill }]} />
    </View>
  );
}

export function Field({ label, value, onChangeText, placeholder, multiline, keyboardType = 'default', secureTextEntry }: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'number-pad' | 'phone-pad' | 'email-address';
  secureTextEntry?: boolean;
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline={multiline}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        style={[styles.input, multiline && styles.inputMultiline]}
        placeholderTextColor="#9A9BA1"
      />
    </View>
  );
}

export function Segmented<T extends string>({ options, value, onChange }: { options: { value: T; label: string }[]; value: T; onChange: (value: T) => void }) {
  return (
    <View style={styles.segmented}>
      {options.map(option => (
        <Pressable
          key={option.value}
          onPress={() => onChange(option.value)}
          style={[styles.segment, value === option.value && styles.segmentActive]}
        >
          <Text style={[styles.segmentText, value === option.value && styles.segmentTextActive]}>{option.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

export function EmptyState({ icon, title, body, action, onAction }: { icon: keyof typeof Ionicons.glyphMap; title: string; body: string; action?: string; onAction?: () => void }) {
  return (
    <Card style={styles.empty}>
      <View style={styles.emptyIcon}><Ionicons name={icon} size={30} /></View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyBody}>{body}</Text>
      {action ? <View style={{ width: '100%', marginTop: 16 }}><Button label={action} onPress={onAction} variant="outline" /></View> : null}
    </Card>
  );
}

export function ModuleTile({ icon, title, summary, onPress }: { icon: keyof typeof Ionicons.glyphMap; title: string; summary: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }: { pressed: boolean }) => [styles.moduleTile, pressed && styles.pressed]}>
      <View style={styles.moduleIcon}><Ionicons name={icon} size={24} /></View>
      <Text style={styles.moduleTitle}>{title}</Text>
      <Text style={styles.moduleSummary}>{summary}</Text>
      <Ionicons name="arrow-forward" size={19} color={colors.red} style={{ marginTop: 10 }} />
    </Pressable>
  );
}

export function StepBar({ current, total }: { current: number; total: number }) {
  return (
    <View style={styles.stepRow}>
      {Array.from({ length: total }).map((_, index) => (
        <View key={index} style={[styles.step, index < current && styles.stepActive]} />
      ))}
    </View>
  );
}

export function QrVisual({ token, size = 220 }: { token: string; size?: number }) {
  const chars = token.split('').map(character => character.charCodeAt(0));
  const cells = Array.from({ length: 121 }, (_, index) => ((chars[index % chars.length] + index * 7) % 5) < 2);
  return (
    <View style={[styles.qr, { width: size, height: size }]}>
      {cells.map((filled, index) => <View key={index} style={{ width: `${100 / 11}%`, height: `${100 / 11}%`, backgroundColor: filled ? colors.black : colors.white }} />)}
      <View style={[styles.qrFinder, { top: 10, left: 10 }]} />
      <View style={[styles.qrFinder, { top: 10, right: 10 }]} />
      <View style={[styles.qrFinder, { bottom: 10, left: 10 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: 18, paddingBottom: 42 },
  pressed: { opacity: 0.65, transform: [{ scale: 0.99 }] },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoBox: { width: 54, height: 54, borderRadius: 17, backgroundColor: colors.yellow, alignItems: 'center', justifyContent: 'center' },
  logoBoxCompact: { width: 38, height: 38, borderRadius: 12 },
  logoK: { fontSize: 39, fontWeight: '900', color: colors.red },
  logoKCompact: { fontSize: 27 },
  logoName: { fontSize: 27, fontWeight: '900' },
  logoNameCompact: { fontSize: 20 },
  logoSub: { alignSelf: 'flex-start', backgroundColor: colors.red, color: colors.white, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3, fontSize: 8, fontWeight: '900', letterSpacing: 1.2 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 18 },
  back: { width: 42, height: 42, borderRadius: 14, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 27, lineHeight: 33, fontWeight: '900' },
  headerSub: { color: colors.muted, marginTop: 3, lineHeight: 19 },
  iconButton: { width: 44, height: 44, borderRadius: 15, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  iconBadge: { position: 'absolute', top: -4, right: -4, minWidth: 19, height: 19, borderRadius: 10, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  iconBadgeText: { color: colors.white, fontSize: 10, fontWeight: '900' },
  card: { backgroundColor: colors.card, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: colors.border, ...shadows.soft },
  button: { minHeight: 54, borderRadius: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  buttonInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  buttonText: { fontSize: 16, fontWeight: '900' },
  section: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 11 },
  sectionTitle: { fontSize: 19, fontWeight: '900' },
  action: { color: colors.red, fontWeight: '800' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 67, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: colors.border },
  rowIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.paleYellow, alignItems: 'center', justifyContent: 'center' },
  rowTitle: { fontSize: 15, fontWeight: '900' },
  rowSub: { color: colors.muted, fontSize: 12, marginTop: 4, lineHeight: 17 },
  pill: { alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  stat: { flex: 1, minHeight: 126 },
  statBlack: { backgroundColor: colors.black, borderColor: colors.black },
  statYellow: { backgroundColor: colors.paleYellow, borderColor: '#F5E49E' },
  statLabel: { color: colors.muted, fontSize: 12 },
  statValue: { fontSize: 24, fontWeight: '900', marginTop: 8 },
  statHelper: { color: colors.muted, fontSize: 11, marginTop: 7, lineHeight: 16 },
  progressTrack: { height: 9, borderRadius: 999, backgroundColor: '#ECECEF', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 999 },
  fieldWrap: { marginBottom: 15 },
  fieldLabel: { fontWeight: '900', marginBottom: 7 },
  input: { minHeight: 53, borderWidth: 1, borderColor: colors.border, borderRadius: 15, paddingHorizontal: 15, fontSize: 16, backgroundColor: colors.white, color: colors.text },
  inputMultiline: { minHeight: 105, paddingTop: 14, textAlignVertical: 'top' },
  segmented: { flexDirection: 'row', backgroundColor: '#ECECEF', borderRadius: 15, padding: 4, gap: 4 },
  segment: { flex: 1, minHeight: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 },
  segmentActive: { backgroundColor: colors.white, ...shadows.soft },
  segmentText: { color: colors.muted, fontWeight: '800', fontSize: 12, textAlign: 'center' },
  segmentTextActive: { color: colors.black },
  empty: { alignItems: 'center', padding: 24 },
  emptyIcon: { width: 58, height: 58, borderRadius: 20, backgroundColor: colors.paleYellow, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 19, fontWeight: '900', marginTop: 14 },
  emptyBody: { color: colors.muted, textAlign: 'center', lineHeight: 21, marginTop: 7 },
  moduleTile: { width: '48.5%', minHeight: 184, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: 20, padding: 15, ...shadows.soft },
  moduleIcon: { width: 46, height: 46, borderRadius: 15, backgroundColor: colors.paleYellow, alignItems: 'center', justifyContent: 'center' },
  moduleTitle: { fontSize: 15, fontWeight: '900', marginTop: 13 },
  moduleSummary: { color: colors.muted, fontSize: 11, lineHeight: 16, marginTop: 5 },
  stepRow: { flexDirection: 'row', gap: 6, marginBottom: 18 },
  step: { flex: 1, height: 6, backgroundColor: '#DEDEE2', borderRadius: 999 },
  stepActive: { backgroundColor: colors.red },
  qr: { flexDirection: 'row', flexWrap: 'wrap', backgroundColor: colors.white, padding: 10, borderRadius: 22, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  qrFinder: { position: 'absolute', width: 44, height: 44, borderWidth: 7, borderColor: colors.black, backgroundColor: colors.white },
});
