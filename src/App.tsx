
import axios from "axios"
import {useEffect, useState} from 'react'

import TableRows from './components/TableRows'
import Pagination from './components/Pagination'

type GithubApiRes = {
  items: Array<GithubRepo>,
  totalCount: number
}

export type GithubRepo = {
  id: number,
  repoName: string,
  repoUrl: string,
  owner: string,
  avatar: string,
  profileUrl: string,
  description: string,
  language: string,
}

function App() {
  const [repos, setRepos] = useState<Map<number, Array<GithubRepo>>>(new Map<number, Array<GithubRepo>>)
  const [totalCount, setTotalCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [page, setPage] = useState<number>(1)
  const [keyword, setkeyword] = useState<string | null>(null)
  
  const getData = async (pageNumber: number) => {
    setIsLoading(true)
    let searchKeyword = "q=Q"
    if (keyword !== null && keyword !== undefined && keyword !== "") {
      searchKeyword = `q=${keyword}`
    }

    try {
      const res: any = await axios.get(`/search/repositories?${searchKeyword}&per_page=30&page=${pageNumber}`, {
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28"
        }
      })
      let items: Array<GithubRepo> = []
      for(let x = 0; x < res.data.items.length; x += 1) {
        items.push({
          id: res.data.items[x].id,
          repoName: res.data.items[x].full_name,
          repoUrl: res.data.items[x].html_url,
          owner: res.data.items[x].owner.login,
          avatar: res.data.items[x].owner.avatar_url,
          profileUrl: res.data.items[x].owner.html_url,
          description: res.data.items[x].description,
          language: res.data.items[x].language,
        })
      }
      return {
        totalCount: res.data.total_count,
        items: items,
      }
    } catch(err) {
      return {
        totalCount: 0,
        items: []
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const dataFetch = async () => {
      const {items, totalCount}: GithubApiRes = await getData(1)
      setRepos(repos.set(page, items))
      setTotalCount(totalCount)
    }

    dataFetch()
  }, [])

  const setCurrentPage = async (pageNumber: number) => {
    setPage(pageNumber)
    if (repos.get(pageNumber) === undefined) {
      const {items} = await getData(pageNumber)
      setRepos(repos.set(pageNumber, items))
    }
  }

  const onSearch = async (e: any) => {
    e.preventDefault()
    repos.clear()
    setTotalCount(0)
    setPage(1)

    const {items, totalCount}: GithubApiRes = await getData(1)
    setRepos(repos.set(1, items))
    setTotalCount(totalCount)
  }

  const handleKeywordChange = (e: any) => {
    setkeyword(e.target.value)
  }

  return (
    <div className="App">
      <div className="header">
        <form onSubmit={onSearch}>
          <input type="text" name="keyword" onChange={handleKeywordChange} height="100%" />
          <button className="search-button" type="submit">Search</button>
        </form>
        <div className='right-align'>
          <span className='caption'>Total Items: </span>
          {totalCount}
        </div>
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th className='center-align-text'>ID</th>
              <th className='center-align-text'>Repository Name</th>
              <th className='center-align-text'>Owner</th>
              <th className='center-align-text'>Description</th>
              <th className='center-align-text'>Language</th>
            </tr>
          </thead>
          <tbody>
            {
              isLoading ? (
                <tr>
                  <td colSpan={100}>
                    <div className='center-align-text'>
                      <span className="loader"></span>
                    </div>
                  </td>
                </tr>
              ) : (
                <TableRows data={repos.get(page) || []} />
              )
            }
          </tbody>
        </table>
        <div className='center-align-text'>
          <Pagination
            postsPerPage={30}
            totalPosts={totalCount}
            currentPage={page}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </div>
  )
}

export default App
