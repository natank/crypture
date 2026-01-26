import { TopNav } from '../components/TopNav';
import { presentationSections } from '../data/sections';

export function App() {
  return (
    <div className="app">
      <TopNav sections={presentationSections} />
      <main>
        {presentationSections.map(({ id, Component }) => (
          <Component key={id} />
        ))}
      </main>
    </div>
  );
}

export default App;
