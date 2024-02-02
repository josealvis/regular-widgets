
let getData = async () => {
  try {
    const response = await fetch("https://favqs.com/api/qotd",
      {
        method: 'get',
        mode: 'no-cors',
        headers: { "Content-Type": "application/json" }
      });
    console.log("detail: ", response.statusText);
    const quotes = await response.json();
    console.log("ok", quotes.quote);
    return quotes.quote;

  } catch (error) {
    console.error("Error:", error);
  }
};

export default async function Page() {
  let colors  = ['sky', 'indigo', 'slate', 'lime', 'violet'];
  let color = colors[Math.floor(Math.random() * colors.length-1 )];
  let quoteOftheDay = await getData();

  
  return (
    <div className="container flex flex-col items-center justify-center h-screen mx-auto px-4 text-xl font-mono
      ">
      <div className={`flex py-5 text-${color}-600 `}>
        <span className="text-6xl">"</span>
        <h1 className="">{quoteOftheDay.body}</h1>
        <span className="text-6xl">"</span>
      </div>
      <h3 className={`w-full text-right text-${color}-400`}>
        <a href={quoteOftheDay.url} target='blanck'>{quoteOftheDay.author}</a>
      </h3>
    </div>
  )
}