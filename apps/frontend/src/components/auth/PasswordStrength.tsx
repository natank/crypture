import { getPasswordStrength } from '@utils/authValidation';

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) return null;

  const strength = getPasswordStrength(password);

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded-full transition-colors duration-200 ${
              strength.score >= level ? strength.color : 'bg-gray-200 dark:bg-gray-700'
            }`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${
        strength.score <= 1 ? 'text-red-500' :
        strength.score === 2 ? 'text-orange-500' :
        strength.score === 3 ? 'text-yellow-600' :
        'text-green-600'
      }`}>
        {password ? strength.label : ''}
      </p>
      <ul className="space-y-1">
        {[
          { key: 'minLength', label: 'At least 8 characters' },
          { key: 'hasUppercase', label: 'One uppercase letter' },
          { key: 'hasLowercase', label: 'One lowercase letter' },
          { key: 'hasNumber', label: 'One number' },
        ].map(({ key, label }) => (
          <li key={key} className={`flex items-center gap-1.5 text-xs ${
            strength.checks[key as keyof typeof strength.checks]
              ? 'text-green-600 dark:text-green-400'
              : 'text-gray-400 dark:text-gray-500'
          }`}>
            <span>{strength.checks[key as keyof typeof strength.checks] ? '✓' : '○'}</span>
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}
