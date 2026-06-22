import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function AgenceLayout({ children }: Props) {
  return <>{children}</>;
}
