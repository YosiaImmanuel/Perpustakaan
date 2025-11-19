import { getBooks, addBook } from "@/lib/actions";

export async function GET() {
  const books = await getBooks();
  return new Response(JSON.stringify(books), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req) {
  const body = await req.json();
  const book = await addBook(body);
  return new Response(JSON.stringify(book), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
