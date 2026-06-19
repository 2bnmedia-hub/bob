const BIG = [
  { name: "כלי עבודה", img: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=700&q=80" },
  { name: "חומרי בניין", img: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=700&q=80" },
];

const SMALL = [
  { name: "בלוני גז וקמפינג", img: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&q=80" },
  { name: "גינה", img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80" },
  { name: "חשמל ביתי", img: "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=400&q=80" },
  { name: "אחסון וארגון", img: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&q=80" },
];

function Tile({ name, img }: { name: string; img: string }) {
  return (
    <a href={"/category/" + encodeURIComponent(name)} className="group relative block h-full w-full overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-line)]">
      <img src={img} alt={name} className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
      <p className="absolute inset-x-0 bottom-0 p-3 text-[17px] font-bold text-white">{name}</p>
    </a>
  );
}

export default function DepartmentBanners() {
  return (
    <section className="mx-auto max-w-[96vw] px-5 py-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {BIG.map(function (d) {
          return (<div key={d.name} className="h-[220px] md:h-[300px]"><Tile name={d.name} img={d.img} /></div>);
        })}
        <div className="col-span-2 grid grid-cols-2 gap-3 md:col-span-1 md:grid-rows-2">
          {SMALL.map(function (d) {
            return (<div key={d.name} className="h-[105px] md:h-[143.5px]"><Tile name={d.name} img={d.img} /></div>);
          })}
        </div>
      </div>
    </section>
  );
}
