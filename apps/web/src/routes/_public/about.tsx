import {createFileRoute, useNavigate} from '@tanstack/react-router'

export const Route = createFileRoute('/_public/about')({
    component: RouteComponent,
})

function RouteComponent() {

    const navigate = useNavigate();

    return (<div>
        <p>Hello "/_public/about"!</p>
        <button className={'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'} onClick={() => navigate({to: '/'})}>Go to home</button>
    </div>)
}