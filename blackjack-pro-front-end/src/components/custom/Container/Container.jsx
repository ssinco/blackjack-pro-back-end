import clsx from 'clsx'

export function Container({ className, ...props }) {
  return (
    <div
      className={clsx(
        'flex justify-center max-w-full items-center sm:mx-auto sm:max-w-7xl lg:px-8'
        , className)}
      {...props}
    />
  )
}


export function ContainerGame({ className, ...props }) {
  return (
    <div
      className={clsx(
        'flex justify-center max-w-sm mx-auto items-center py-4 sm:mx-auto sm:max-w-7xl lg:px-8'
        , className)}
      {...props}
    />
  )
}

