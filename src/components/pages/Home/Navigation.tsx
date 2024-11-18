import Link from "next/link";

export const Navigation = () => {
  const links = [
    {
      name: "About",
      url: "/about",
    },
    {
      name: "Help",
      url: "/help",
    },
  ];
  return (
    <div className="font-sora flex items-center gap-x-5">
      {links.map((link) => (
        <Link
          key={link.url}
          href={link.url}
          className="underline text-xl hover:opacity-80"
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
};
