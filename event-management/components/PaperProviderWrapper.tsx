import type { PropsWithChildren, ReactElement } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';

type Props = PropsWithChildren<{
    children: ReactElement[];
}>;

export default function PaperProviderWrapper ({ children }: Props) {
  return <PaperProvider>{children}</PaperProvider>;
};