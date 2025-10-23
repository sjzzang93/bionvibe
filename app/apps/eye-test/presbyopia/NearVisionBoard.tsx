'use client';

export default function NearVisionBoard({
  pt,
  line,
}: {
  pt: number;
  line: string;
}) {
  return (
    <div className="my-6 text-center py-8">
      <p style={{ fontSize: `${pt}px`, lineHeight: 1.4 }} className="eye-safe-text font-medium">
        {line}
      </p>
    </div>
  );
}

