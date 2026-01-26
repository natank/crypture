interface DemoStepsProps {
  steps: { title: string; detail: string }[];
}

export function DemoSteps({ steps }: DemoStepsProps) {
  return (
    <div className="demo-steps card">
      <p className="label">Guided tour</p>
      <ol>
        {steps.map((step, index) => (
          <li key={step.title}>
            <span className="demo-steps__index">{index + 1}</span>
            <div>
              <strong>{step.title}</strong>
              <p>{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
