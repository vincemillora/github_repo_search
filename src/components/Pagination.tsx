type PaginationProps = {
  postsPerPage: number,
  totalPosts: number,
  currentPage: number,
  setCurrentPage: (pageNumber: number) => void,
}

const Pagination = ({ postsPerPage, totalPosts, currentPage, setCurrentPage }: PaginationProps) => {
  const pageNumbers = []
  let paginationStart = currentPage
  if ((paginationStart - 5) > 0) {
    paginationStart = paginationStart - 5
  } else {
    paginationStart = 1
  }
  for (let x = paginationStart; x <= Math.ceil(totalPosts / postsPerPage); x += 1) {
    pageNumbers.push(x)
    if (pageNumbers.length > 9) {
      break
    }
  }
 
  return (
    <ul className="pagination">
      {
        currentPage > 1 ? (
          <li
            onClick={() => setCurrentPage(currentPage - 1)}
            className="page-number"
          >
            {"<"}
          </li>
        ) :  ""
      }
      {
        (paginationStart > 1) ? (
          <li
            className="page-number"
          >
            ...
          </li>
        ) :  ""
      }
      {pageNumbers.map((number) => (
        <li
          key={number}
          onClick={() => setCurrentPage(number)}
          className={currentPage === number ? "page-number active" : "page-number"}
        >
          {number}
        </li>
      ))}
      {
        postsPerPage < totalPosts && Math.abs((currentPage - Math.ceil(totalPosts / postsPerPage))) > 9 ? (
          <li
            className="page-number"
          >
            ... 
          </li>
        ) :  ""
      }
      {
        postsPerPage < totalPosts ? (
          <li
            onClick={() => setCurrentPage(currentPage + 1)}
            className="page-number"
          >
            {">"}
          </li>
        ) :  ""
      }
    </ul>
  )
}
 
export default Pagination