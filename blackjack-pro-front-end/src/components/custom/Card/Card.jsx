import clsx from 'clsx'


export function Card ({className, ...props}) {
    return (
        <div
        className={clsx(
        'flex justify-between w-full rounded-3xl bg-white px-4 py-8 shadow-md shadow-gray-900/5'
        , className)}
        {...props}
        />
    )
}