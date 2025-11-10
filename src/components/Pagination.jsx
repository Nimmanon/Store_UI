import Tippy from "@tippyjs/react";

const pagelist = [5, 10, 20, 25, 50, 100];

const Pagination = ({
  page,
  totalpage,
  columnpage,
  onPreviousClick,
  onNextClick,
  onFirstPageClick,
  onLastPageClick,
  onPageChange,
  showColumnpage = true,
  showPageNumber = true,
}) => {
  return (
    <div className="lg:flex justify-between">      
      <nav className="flex flex-wrap gap-1 p-2">
        <button
          type="button"
          onClick={onFirstPageClick}
          className="btn btn_primary"
        >
          First
        </button>
        <button
          type="button"
          onClick={onPreviousClick}
          className="btn btn_outlined btn_secondary"
        >
          Prev
        </button>
        <button
          type="button"
          onClick={onNextClick}
          className="btn btn_outlined btn_secondary"
        >
          Next
        </button>
        <button
          type="button"
          onClick={onLastPageClick}
          className="btn btn_secondary"
        >
          Last
        </button>
      </nav>
      {/* } */}
      {showColumnpage === true && (
        <div className="flex items-center gap-2 ml-auto mr-auto p-2 pr-1">
          {showPageNumber && (
            <>
              {" "}
              Page {page} of {totalpage} pages
            </>
          )}

          {showColumnpage && (
            <>
              <span>Show</span>
              <Tippy
                theme="light-border"
                offset={[0, 8]}
                arrow={false}
                placement="bottom-start"
                trigger="click"
                interactive={true}
                allowHTML={true}
                animation="shift-toward-extreme"
                onAfterUpdate={(instance) => {
                  instance.hide();
                }}
                content={
                  <div className="max-h-screen">
                    <div className="dropdown-menu px-4">
                      {pagelist.map((page) => {
                        return (
                          <li
                            key={page}
                            className="list-none"
                            onClick={() => onPageChange(page)}
                          >
                            {page}
                          </li>
                        );
                      })}
                    </div>
                  </div>
                }
                appendTo={() => document.body}
              >
                <button  type="button" className="btn btn_outlined btn_secondary">
                  {columnpage}
                  <span className="ml-3 mr-3 la la-caret-down text-xl leading-none" />
                </button>
              </Tippy>
              <span>items</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Pagination;
