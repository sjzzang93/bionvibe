export default function Head() {
  const title = 'MBTI 테스트 - 32문항으로 보는 성격 유형';
  const description =
    '정확도를 높인 32문항 MBTI 테스트로 나의 성격 유형과 강점을 알아보세요. 결과 해석과 관련 추천 콘텐츠를 함께 제공합니다.';
  const url = 'https://bionvibe.com/apps/mbti-test';

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
