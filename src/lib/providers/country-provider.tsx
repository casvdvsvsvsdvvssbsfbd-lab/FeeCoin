// ============================================
// Country Provider
// Production-ready country management
// ============================================

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';

export interface Country {
  code: string;
  name: string;
  phoneCode?: string;
  currency?: string;
  currencySymbol?: string;
  timezone?: string;
  isActive: boolean;
}

interface CountryContextType {
  country: Country | null;
  setCountry: (country: Country) => void;
  countries: Country[];
  isLoading: boolean;
  error: Error | null;
  refreshCountries: () => Promise<void>;
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

const DEFAULT_COUNTRIES: Country[] = [
  { code: 'US', name: 'United States', phoneCode: '+1', currency: 'USD', currencySymbol: '$', timezone: 'America/New_York', isActive: true },
  { code: 'GB', name: 'United Kingdom', phoneCode: '+44', currency: 'GBP', currencySymbol: '£', timezone: 'Europe/London', isActive: true },
  { code: 'DE', name: 'Germany', phoneCode: '+49', currency: 'EUR', currencySymbol: '€', timezone: 'Europe/Berlin', isActive: true },
  { code: 'FR', name: 'France', phoneCode: '+33', currency: 'EUR', currencySymbol: '€', timezone: 'Europe/Paris', isActive: true },
  { code: 'ES', name: 'Spain', phoneCode: '+34', currency: 'EUR', currencySymbol: '€', timezone: 'Europe/Madrid', isActive: true },
  { code: 'IT', name: 'Italy', phoneCode: '+39', currency: 'EUR', currencySymbol: '€', timezone: 'Europe/Rome', isActive: true },
  { code: 'BR', name: 'Brazil', phoneCode: '+55', currency: 'BRL', currencySymbol: 'R$', timezone: 'America/Sao_Paulo', isActive: true },
  { code: 'IN', name: 'India', phoneCode: '+91', currency: 'INR', currencySymbol: '₹', timezone: 'Asia/Kolkata', isActive: true },
  { code: 'CN', name: 'China', phoneCode: '+86', currency: 'CNY', currencySymbol: '¥', timezone: 'Asia/Shanghai', isActive: true },
  { code: 'JP', name: 'Japan', phoneCode: '+81', currency: 'JPY', currencySymbol: '¥', timezone: 'Asia/Tokyo', isActive: true },
  { code: 'KR', name: 'South Korea', phoneCode: '+82', currency: 'KRW', currencySymbol: '₩', timezone: 'Asia/Seoul', isActive: true },
  { code: 'RU', name: 'Russia', phoneCode: '+7', currency: 'RUB', currencySymbol: '₽', timezone: 'Europe/Moscow', isActive: true },
  { code: 'UA', name: 'Ukraine', phoneCode: '+380', currency: 'UAH', currencySymbol: '₴', timezone: 'Europe/Kiev', isActive: true },
  { code: 'TR', name: 'Turkey', phoneCode: '+90', currency: 'TRY', currencySymbol: '₺', timezone: 'Europe/Istanbul', isActive: true },
  { code: 'SA', name: 'Saudi Arabia', phoneCode: '+966', currency: 'SAR', currencySymbol: '﷼', timezone: 'Asia/Riyadh', isActive: true },
  { code: 'AE', name: 'UAE', phoneCode: '+971', currency: 'AED', currencySymbol: 'د.إ', timezone: 'Asia/Dubai', isActive: true },
  { code: 'EG', name: 'Egypt', phoneCode: '+20', currency: 'EGP', currencySymbol: '£', timezone: 'Africa/Cairo', isActive: true },
  { code: 'NG', name: 'Nigeria', phoneCode: '+234', currency: 'NGN', currencySymbol: '₦', timezone: 'Africa/Lagos', isActive: true },
  { code: 'ZA', name: 'South Africa', phoneCode: '+27', currency: 'ZAR', currencySymbol: 'R', timezone: 'Africa/Johannesburg', isActive: true },
  { code: 'MX', name: 'Mexico', phoneCode: '+52', currency: 'MXN', currencySymbol: '$', timezone: 'America/Mexico_City', isActive: true },
];

interface CountryProviderProps {
  children: ReactNode;
  storageKey?: string;
}

export const CountryProvider: React.FC<CountryProviderProps> = ({
  children,
  storageKey = 'fee_country',
}) => {
  const [country, setCountryState] = useState<Country | null>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as Country;
        const found = DEFAULT_COUNTRIES.find((c) => c.code === parsed.code);
        if (found) return found;
      }
    } catch {
      // Ignore
    }
    return null;
  });

  const [countries, setCountries] = useState<Country[]>(DEFAULT_COUNTRIES);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadCountries = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // In production, load from API
        // For now, use default countries
        setCountries(DEFAULT_COUNTRIES);

        // Auto-detect country from IP if not set
        if (!country) {
          try {
            const response = await fetch('https://ipapi.co/json/');
            if (response.ok) {
              const data = await response.json();
              const detectedCountry = DEFAULT_COUNTRIES.find((c) => c.code === data.country_code);
              if (detectedCountry) {
                setCountryState(detectedCountry);
                localStorage.setItem(storageKey, JSON.stringify(detectedCountry));
              }
            }
          } catch {
            // Ignore detection errors
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load countries'));
      } finally {
        setIsLoading(false);
      }
    };

    loadCountries();
  }, [country, storageKey]);

  const setCountry = useCallback((newCountry: Country) => {
    setCountryState(newCountry);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newCountry));
    } catch {
      // Ignore storage errors
    }
  }, [storageKey]);

  const refreshCountries = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In production, refresh from API
      // For now, just reload default countries
      setCountries([...DEFAULT_COUNTRIES]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to refresh countries'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: CountryContextType = {
    country,
    setCountry,
    countries,
    isLoading,
    error,
    refreshCountries,
  };

  return <CountryContext.Provider value={value}>{children}</CountryContext.Provider>;
};

export const useCountry = (): CountryContextType => {
  const context = useContext(CountryContext);
  if (!context) {
    throw new Error('useCountry must be used within a CountryProvider');
  }
  return context;
};

export const useCurrentCountry = (): Country | null => {
  const { country } = useCountry();
  return country;
};

export const useCountries = (): Country[] => {
  const { countries } = useCountry();
  return countries;
};