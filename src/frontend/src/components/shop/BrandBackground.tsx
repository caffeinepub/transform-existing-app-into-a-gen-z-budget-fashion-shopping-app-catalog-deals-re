export default function BrandBackground() {
  return (
    <div 
      className="fixed inset-0 -z-10 opacity-10 pointer-events-none"
      style={{
        backgroundImage: 'url(/assets/generated/genz-gradient-bg.dim_1440x900.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    />
  );
}
