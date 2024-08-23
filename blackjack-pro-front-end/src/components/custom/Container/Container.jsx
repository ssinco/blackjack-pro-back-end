import clsx from 'clsx'

export function Container({ className, ...props }) {
  return (
    <div
      className={clsx(
        'flex justify-center mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'
        , className)}
      {...props}
    />
  )
}


export function ContainerGame({ className, ...props }) {
  return (
    <div
      className={clsx(
        'flex justify-center mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'
        , className)}
      {...props}
    />
  )
}

