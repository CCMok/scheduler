export default function SettingPageIntro({
  title,
  support,
}: Readonly<{
  title: string;
  support?: string;
}>) {
  return (
    <div className="setting-page-intro">
      <h1 className="setting-page-title">{title}</h1>
      {support ? <p className="setting-page-support">{support}</p> : null}
    </div>
  );
}
