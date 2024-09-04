
import { Avatar } from './avatar'
import { Badge } from './badge'
import { Divider } from './divider'
import { Heading, Subheading } from './heading'
import { Select } from './select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table'

export function Stat({ title, value, change }) {
    return (
      <div>
        <div className="mt-6 text-xs font-medium text-gray-400 sm:text-sm/6 text-center">{title}</div>
        <div className="mt-2 text-2xl/8 font-semibold text-white sm:text-2xl/8 text-center">{value}</div>
        {/* <div className="mt-3 text-sm/6 sm:text-xs/6">
          <Badge color={change.startsWith('+') ? 'lime' : 'pink'}>{change}</Badge>{' '}
          <span className="text-zinc-500">from last week</span>
        </div> */}
      </div>
    )
  }
