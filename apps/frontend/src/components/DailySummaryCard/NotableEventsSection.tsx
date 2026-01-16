/**
 * NotableEventsSection - Displays notable portfolio events
 * Backlog Item 25 - REQ-013-notifications
 */

import type { NotableEvent } from 'types/summary';

interface NotableEventsSectionProps {
  events: NotableEvent[];
}

function getEventIcon(type: NotableEvent['type']): string {
  switch (type) {
    case 'alert_triggered':
      return '🔔';
    case 'significant_move':
      return '📈';
    case 'price_milestone':
      return '🎯';
    default:
      return '•';
  }
}

export default function NotableEventsSection({ events }: NotableEventsSectionProps) {
  if (events.length === 0) {
    return null;
  }

  return (
    <div
      className="mt-4 pt-4 border-t border-border"
      data-testid="notable-events"
    >
      <h3 className="text-sm font-medium text-text-muted mb-2 flex items-center gap-1">
        <span aria-hidden="true">🔔</span>
        Notable Events
      </h3>
      <ul className="space-y-1" aria-label="Notable events">
        {events.map((event) => (
          <li
            key={event.id}
            className="text-sm text-text flex items-start gap-2"
            data-testid={`event-${event.type}`}
          >
            <span aria-hidden="true" className="flex-shrink-0">
              {getEventIcon(event.type)}
            </span>
            <span>{event.message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
