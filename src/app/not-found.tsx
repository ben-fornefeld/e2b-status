export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center pt-[45%]">
      <h1 className="text-2xl">Nothing here 🤷‍♂️</h1>
      <p className="text-md mt-1 flex max-w-[300px] text-center text-muted-foreground">
        Seems like the page you are looking for does not exist.
      </p>
    </div>
  );
}
