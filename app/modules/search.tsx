import { useMemo, useState } from 'react';
import { router } from 'expo-router';
import { Card, EmptyState, Field, Header, ModuleTile, Screen, Section } from '@/components/ui';
import { schoolModules } from '@/data/mock';

export default function ModuleSearch() {
  const [query, setQuery] = useState('');
  const results = useMemo(() => schoolModules.filter(item => `${item.title} ${item.summary}`.toLowerCase().includes(query.toLowerCase())), [query]);
  return (
    <Screen>
      <Header title="Search school modules" subtitle="Find any current or future school workflow" back onBack={() => router.back()} />
      <Field label="Search" value={query} onChangeText={setQuery} placeholder="Transport, library, admissions…" />
      <Section title={`${results.length} module${results.length === 1 ? '' : 's'}`} />
      {!results.length ? <EmptyState icon="search-outline" title="No matching modules" body="Try a broader school function or keyword." /> : <Card>{results.map(item => <ModuleTile key={item.slug} icon={item.icon as never} title={item.title} summary={item.summary} onPress={() => router.push(`/modules/${item.slug}` as never)} />)}</Card>}
    </Screen>
  );
}
