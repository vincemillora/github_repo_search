import {GithubRepo} from '../App'

type TableRowsProps = {
  data: Array<GithubRepo> | any
}

function TableRows({data}: TableRowsProps) {
  const listItems = data.map((item: any) =>
    <tr key={item.id}>
      <td className='right-align-text'>{item.id}</td>
      <td className='center-align-text'>
        <a href={item.repoUrl} target="_blank">{item.repoName}</a>
      </td>
      <td className='center-align-text'>
        <a href={item.profileUrl} target="_blank">
          <img src={item.avatar} className='avatar' />
          <div>{item.owner}</div>
        </a>
      </td>
      <td>{item.description}</td>
      <td className='center-align-text'>{item.language}</td>
    </tr>
  )

  return listItems
}

export default TableRows
