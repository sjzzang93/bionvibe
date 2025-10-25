export default function Head() {
  const title = '오늘의 운세 - 12개 별자리 맞춤 리포트';
  const description =
    '12개 별자리별 오늘의 기운, 애정·금전·건강 지수와 행운 아이템까지 한 번에 확인하세요. BION이 매일 업데이트하는 맞춤 운세 리포트입니다.';
  const url = 'https://bionvibe.com/apps/today-fortune';

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="https://bionvibe.com/og-image.png" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </>
  );
}
