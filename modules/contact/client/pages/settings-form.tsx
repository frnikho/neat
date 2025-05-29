'use server';

export default async function Page() {

    const res = await fetch('https://jsonplaceholder.typicode.com/posts');

    const result = await res.json();

    return (
        <div>
            Hello
        </div>
    )
}