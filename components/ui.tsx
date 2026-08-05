import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
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
import { colors, radii, shadows } from '@/constants/theme';

export function Screen({
  children,
  scroll = true,
  style,
  background = 'default',
}: {
  children: React.ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
  background?: 'default' | 'warm' | 'white' | 'black';
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 260, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }, [opacity, translateY]);

  const backgroundColor =
    background === 'warm'
      ? colors.backgroundWarm
      : background === 'white'
        ? colors.white
        : background === 'black'
          ? colors.black
          : colors.background;

  const body = scroll ? (
    <ScrollView
      contentContainerStyle={[styles.content, style]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      overScrollMode="never"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, styles.flex, style]}>{children}</View>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor }]}>
      <Animated.View style={[styles.flex, { opacity, transform: [{ translateY }] }]}>{body}</Animated.View>
    </SafeAreaView>
  );
}

export function Logo({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <View style={styles.logoRow}>
      <View style={[styles.logoMarkWrap, compact && styles.logoMarkWrapCompact]}>
        <Image
          source={require('../assets/splash-icon.png')}
          resizeMode="contain"
          style={[styles.logoMark, compact && styles.logoMarkCompact]}
        />
      </View>
      <View>
        <Text style={[styles.logoName, light && styles.logoNameLight, compact && styles.logoNameCompact]}>Karibu</Text>
        <Text style={styles.logoSub}>FOR SCHOOLS</Text>
      </View>
    </View>
  );
}

export function Header({
  title,
  subtitle,
  back,
  onBack,
  right,
}: {
  title: string;
  subtitle?: string;
  back?: boolean;
  onBack?: () => void;
  right?: React.ReactNode;
}) {
  return (
    <View style={styles.header}>
      {back ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}
          onPress={onBack}
          style={({ pressed }) => [styles.back, pressed && styles.pressed]}
        >
          <Ionicons name="chevron-back" size={23} color={colors.black} />
        </Pressable>
      ) : null}
      <View style={styles.headerCopy}>
        <Text style={styles.headerTitle}>{title}</Text>
        {subtitle ? <Text style={styles.headerSub}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

export function IconButton({
  icon,
  onPress,
  badge,
  dark = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  badge?: number;
  dark?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.iconButton, dark && styles.iconButtonDark, pressed && styles.pressed]}
    >
      <Ionicons name={icon} size={22} color={dark ? colors.white : colors.black} />
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
  const bg =
    variant === 'red'
      ? colors.red
      : variant === 'black'
        ? colors.black
        : variant === 'yellow'
          ? colors.yellow
          : variant === 'green'
            ? colors.green
            : colors.white;
  const fg = variant === 'yellow' || variant === 'outline' ? colors.black : colors.white;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === 'red' && shadows.red,
        variant === 'outline' && styles.buttonOutline,
        {
          backgroundColor: bg,
          opacity: disabled ? 0.42 : pressed ? 0.84 : 1,
          transform: [{ scale: pressed ? 0.985 : 1 }],
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
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
      {action ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={styles.action}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function Row({
  icon,
  title,
  subtitle,
  onPress,
  right,
  last = false,
}: {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  right?: React.ReactNode;
  last?: boolean;
}) {
  return (
    <Pressable
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [styles.row, last && styles.rowLast, pressed && onPress ? styles.pressed : null]}
    >
      {icon ? (
        <View style={styles.rowIcon}>
          <Ionicons name={icon} size={21} color={colors.black} />
        </View>
      ) : null}
      <View style={styles.flex}>
        <Text style={styles.rowTitle}>{title}</Text>
        {subtitle ? <Text style={styles.rowSub}>{subtitle}</Text> : null}
      </View>
      {right ?? (onPress ? <Ionicons name="chevron-forward" size={18} color={colors.mutedSoft} /> : null)}
    </Pressable>
  );
}

export function Pill({
  label,
  tone = 'green',
}: {
  label: string;
  tone?: 'green' | 'red' | 'yellow' | 'black' | 'blue' | 'purple';
}) {
  const bg =
    tone === 'green'
      ? colors.paleGreen
      : tone === 'red'
        ? colors.paleRed
        : tone === 'yellow'
          ? colors.paleYellow
          : tone === 'blue'
            ? colors.paleBlue
            : tone === 'purple'
              ? colors.palePurple
              : '#ECECEF';
  const fg =
    tone === 'green'
      ? colors.green
      : tone === 'red'
        ? colors.red
        : tone === 'yellow'
          ? colors.amber
          : tone === 'blue'
            ? colors.blue
            : tone === 'purple'
              ? colors.purple
              : colors.black;

  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <Text style={[styles.pillText, { color: fg }]}>{label}</Text>
    </View>
  );
}

export function Money({ value, style }: { value: number; style?: StyleProp<TextStyle> }) {
  return <Text style={style}>UGX {value.toLocaleString('en-GB')}</Text>;
}

export function Stat({
  label,
  value,
  helper,
  tone = 'white',
}: {
  label: string;
  value: string;
  helper: string;
  tone?: 'white' | 'black' | 'yellow';
}) {
  const dark = tone === 'black';
  return (
    <Card style={[styles.stat, dark ? styles.statBlack : tone === 'yellow' ? styles.statYellow : null]}>
      <Text style={[styles.statLabel, dark && styles.textOnDarkMuted]}>{label}</Text>
      <Text style={[styles.statValue, dark && styles.textOnDark]}>{value}</Text>
      <Text style={[styles.statHelper, dark && styles.textOnDarkMuted]}>{helper}</Text>
    </Card>
  );
}

export function Progress({ value, tone = 'red' }: { value: number; tone?: 'red' | 'green' | 'blue' }) {
  const fill = tone === 'green' ? colors.green : tone === 'blue' ? colors.blue : colors.red;
  return (
    <View style={styles.progressTrack}>
      <View
        style={[
          styles.progressFill,
          { width: `${Math.max(0, Math.min(100, value))}%`, backgroundColor: fill },
        ]}
      />
    </View>
  );
}

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
  keyboardType = 'default',
  secureTextEntry,
}: {
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
        placeholderTextColor={colors.mutedSoft}
        selectionColor={colors.red}
      />
    </View>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <View style={styles.segmented}>
      {options.map(option => (
        <Pressable
          key={option.value}
          onPress={() => onChange(option.value)}
          style={({ pressed }) => [
            styles.segment,
            value === option.value && styles.segmentActive,
            pressed && styles.pressed,
          ]}
        >
          <Text style={[styles.segmentText, value === option.value && styles.segmentTextActive]}>{option.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

export function EmptyState({
  icon,
  title,
  body,
  action,
  onAction,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <Card style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Ionicons name={icon} size={30} color={colors.black} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyBody}>{body}</Text>
      {action ? (
        <View style={styles.emptyAction}>
          <Button label={action} onPress={onAction} variant="outline" />
        </View>
      ) : null}
    </Card>
  );
}

export function ModuleTile({
  icon,
  title,
  summary,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  summary: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.moduleTile, pressed && styles.pressed]}>
      <View style={styles.moduleIcon}>
        <Ionicons name={icon} size={23} color={colors.black} />
      </View>
      <Text style={styles.moduleTitle}>{title}</Text>
      <Text style={styles.moduleSummary}>{summary}</Text>
      <View style={styles.moduleArrow}>
        <Ionicons name="arrow-forward" size={17} color={colors.white} />
      </View>
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

export function QuickAction({
  icon,
  label,
  onPress,
  tone = 'yellow',
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  tone?: 'yellow' | 'red' | 'blue' | 'green' | 'black';
}) {
  const backgroundColor =
    tone === 'red'
      ? colors.paleRed
      : tone === 'blue'
        ? colors.paleBlue
        : tone === 'green'
          ? colors.paleGreen
          : tone === 'black'
            ? '#ECECEF'
            : colors.paleYellow;
  const iconColor =
    tone === 'red'
      ? colors.red
      : tone === 'blue'
        ? colors.blue
        : tone === 'green'
          ? colors.green
          : colors.black;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.quickAction, pressed && styles.pressed]}>
      <View style={[styles.quickActionIcon, { backgroundColor }]}>
        <Ionicons name={icon} size={23} color={iconColor} />
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </Pressable>
  );
}

export function SuccessArtwork({
  tone = 'green',
  icon = 'checkmark',
}: {
  tone?: 'green' | 'red' | 'yellow' | 'blue';
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  const color =
    tone === 'green' ? colors.green : tone === 'red' ? colors.red : tone === 'yellow' ? colors.amber : colors.blue;
  const pale =
    tone === 'green'
      ? colors.paleGreen
      : tone === 'red'
        ? colors.paleRed
        : tone === 'yellow'
          ? colors.paleYellow
          : colors.paleBlue;
  return (
    <View style={styles.successWrap}>
      <View style={[styles.successHaloLarge, { backgroundColor: pale }]} />
      <View style={[styles.successHaloSmall, { backgroundColor: `${color}22` }]} />
      <View style={[styles.successCircle, { backgroundColor: color }]}>
        <Ionicons name={icon} size={46} color={colors.white} />
      </View>
    </View>
  );
}

export function QrVisual({ token, size = 220 }: { token: string; size?: number }) {
  const chars = token.split('').map(character => character.charCodeAt(0));
  const cells = Array.from({ length: 121 }, (_, index) => ((chars[index % chars.length] + index * 7) % 5) < 2);
  return (
    <View style={[styles.qr, { width: size, height: size }]}>
      {cells.map((filled, index) => (
        <View
          key={index}
          style={{
            width: `${100 / 11}%`,
            height: `${100 / 11}%`,
            backgroundColor: filled ? colors.black : colors.white,
          }}
        />
      ))}
      <View style={[styles.qrFinder, styles.qrFinderTopLeft]} />
      <View style={[styles.qrFinder, styles.qrFinderTopRight]} />
      <View style={[styles.qrFinder, styles.qrFinderBottomLeft]} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 118 },
  pressed: { opacity: 0.72, transform: [{ scale: 0.985 }] },

  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoMarkWrap: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...shadows.soft,
  },
  logoMarkWrapCompact: { width: 39, height: 39, borderRadius: 13 },
  logoMark: { width: 47, height: 47 },
  logoMarkCompact: { width: 35, height: 35 },
  logoName: { fontSize: 27, fontWeight: '900', color: colors.black, letterSpacing: -0.7 },
  logoNameLight: { color: colors.white },
  logoNameCompact: { fontSize: 20 },
  logoSub: {
    alignSelf: 'flex-start',
    backgroundColor: colors.red,
    color: colors.white,
    borderRadius: radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.2,
  },

  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  headerCopy: { flex: 1 },
  back: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.soft,
  },
  headerTitle: { fontSize: 30, lineHeight: 35, fontWeight: '900', color: colors.text, letterSpacing: -0.9 },
  headerSub: { color: colors.muted, marginTop: 4, lineHeight: 19, fontSize: 14 },
  iconButton: {
    width: 45,
    height: 45,
    borderRadius: 16,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.soft,
  },
  iconButtonDark: { backgroundColor: '#252527' },
  iconBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    minWidth: 19,
    height: 19,
    borderRadius: 10,
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: colors.white,
  },
  iconBadgeText: { color: colors.white, fontSize: 9, fontWeight: '900' },

  card: { backgroundColor: colors.card, borderRadius: radii.large, padding: 17, ...shadows.soft },
  button: {
    minHeight: 57,
    borderRadius: radii.medium,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  buttonOutline: { borderWidth: 1, borderColor: colors.borderStrong, ...shadows.hairline },
  buttonInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  buttonText: { fontSize: 16, fontWeight: '900', letterSpacing: -0.2 },

  section: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 27, marginBottom: 12 },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: colors.text, letterSpacing: -0.45 },
  action: { color: colors.red, fontWeight: '800', fontSize: 13 },

  row: { flexDirection: 'row', alignItems: 'center', gap: 13, minHeight: 70, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: colors.border },
  rowLast: { borderBottomWidth: 0 },
  rowIcon: { width: 44, height: 44, borderRadius: 15, backgroundColor: colors.paleYellow, alignItems: 'center', justifyContent: 'center' },
  rowTitle: { fontSize: 15, fontWeight: '800', color: colors.text, letterSpacing: -0.15 },
  rowSub: { color: colors.muted, fontSize: 12, marginTop: 4, lineHeight: 17 },

  pill: { alignSelf: 'flex-start', borderRadius: radii.pill, paddingHorizontal: 10, paddingVertical: 6 },
  pillText: { fontSize: 10, fontWeight: '900', letterSpacing: 0.4 },

  stat: { flex: 1, minHeight: 128, padding: 16 },
  statBlack: { backgroundColor: colors.black },
  statYellow: { backgroundColor: colors.paleYellow },
  statLabel: { color: colors.muted, fontSize: 12, fontWeight: '700' },
  statValue: { fontSize: 25, fontWeight: '900', marginTop: 9, color: colors.text, letterSpacing: -0.7 },
  statHelper: { color: colors.muted, fontSize: 11, marginTop: 8, lineHeight: 16 },
  textOnDark: { color: colors.white },
  textOnDarkMuted: { color: '#CFCFD4' },

  progressTrack: { height: 8, borderRadius: radii.pill, backgroundColor: '#ECECEF', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: radii.pill },

  fieldWrap: { marginBottom: 16 },
  fieldLabel: { fontWeight: '800', marginBottom: 8, color: colors.text, fontSize: 13 },
  input: {
    minHeight: 56,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.medium,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: colors.white,
    color: colors.text,
    ...shadows.hairline,
  },
  inputMultiline: { minHeight: 112, paddingTop: 15, textAlignVertical: 'top' },

  segmented: { flexDirection: 'row', backgroundColor: '#EDEDEF', borderRadius: radii.medium, padding: 4, gap: 4 },
  segment: { flex: 1, minHeight: 43, borderRadius: 14, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 },
  segmentActive: { backgroundColor: colors.white, ...shadows.soft },
  segmentText: { color: colors.muted, fontWeight: '800', fontSize: 12, textAlign: 'center' },
  segmentTextActive: { color: colors.black },

  empty: { alignItems: 'center', padding: 26 },
  emptyIcon: { width: 62, height: 62, borderRadius: 21, backgroundColor: colors.paleYellow, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 20, fontWeight: '900', marginTop: 15, color: colors.text },
  emptyBody: { color: colors.muted, textAlign: 'center', lineHeight: 21, marginTop: 7 },
  emptyAction: { width: '100%', marginTop: 18 },

  moduleTile: { width: '48.5%', minHeight: 190, backgroundColor: colors.white, borderRadius: radii.large, padding: 16, ...shadows.soft },
  moduleIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: colors.paleYellow, alignItems: 'center', justifyContent: 'center' },
  moduleTitle: { fontSize: 16, fontWeight: '900', marginTop: 14, color: colors.text },
  moduleSummary: { color: colors.muted, fontSize: 11, lineHeight: 16, marginTop: 6, minHeight: 48 },
  moduleArrow: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.black, alignItems: 'center', justifyContent: 'center', marginTop: 10 },

  stepRow: { flexDirection: 'row', gap: 7, marginBottom: 18 },
  step: { flex: 1, height: 5, backgroundColor: '#E1E1E5', borderRadius: radii.pill },
  stepActive: { backgroundColor: colors.red },

  quickAction: { flex: 1, alignItems: 'center', minWidth: 68 },
  quickActionIcon: { width: 52, height: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  quickActionLabel: { marginTop: 8, fontSize: 11, fontWeight: '800', color: colors.text, textAlign: 'center' },

  successWrap: { width: 132, height: 132, alignItems: 'center', justifyContent: 'center' },
  successHaloLarge: { position: 'absolute', width: 132, height: 132, borderRadius: 66 },
  successHaloSmall: { position: 'absolute', width: 102, height: 102, borderRadius: 51 },
  successCircle: { width: 76, height: 76, borderRadius: 38, alignItems: 'center', justifyContent: 'center', ...shadows.floating },

  qr: { flexDirection: 'row', flexWrap: 'wrap', backgroundColor: colors.white, padding: 10, borderRadius: 24, overflow: 'hidden', ...shadows.floating },
  qrFinder: { position: 'absolute', width: 44, height: 44, borderWidth: 7, borderColor: colors.black, backgroundColor: colors.white },
  qrFinderTopLeft: { top: 10, left: 10 },
  qrFinderTopRight: { top: 10, right: 10 },
  qrFinderBottomLeft: { bottom: 10, left: 10 },
});
