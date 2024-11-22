export default function Footer() {
  return (
    <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
      <p>
        Brought to you by{" "}
        <a
          href="https://github.com/ben-fornefeld"
          target="_blank"
          className="font-bold hover:underline"
          rel="noreferrer"
        >
          Ben
        </a>
      </p>

      {/* <ThemeSwitch /> */}
    </footer>
  );
}
