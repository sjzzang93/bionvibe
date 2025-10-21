export default function AppsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark">
      {children}
    </div>
  );
}

