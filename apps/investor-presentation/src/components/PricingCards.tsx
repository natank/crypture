interface PricingCardsProps {
  tiers: { name: string; description: string; price: string }[];
}

export function PricingCards({ tiers }: PricingCardsProps) {
  return (
    <div className="pricing-grid">
      {tiers.map((tier) => (
        <div key={tier.name} className="pricing-card">
          <p className="label">{tier.name}</p>
          <p className="pricing-card__price">{tier.price}</p>
          <p>{tier.description}</p>
        </div>
      ))}
    </div>
  );
}
