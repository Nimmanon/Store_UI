const CustomModal = ({
  name,
  size,
  show,
  action,
  content,
  form,
  handleCancelClick,
  showTitle = true,
  showFooter = true,
  title = "",
}) => {
  return (
    <>
      <div
        className={`modal animate__animated ${
          show ? "animate__fadeInDown active" : "animate__fadeOutUp"
        }`}
      >
        <div
          className={`${
            size === "full"
              ? "modal-dialog"
              : "modal-dialog-center modal-dialog_centered"
          }`}
        >
          <div className={`modal-content max-w-${size} min-w-${size}`}>
            <div className={`modal-content`}>
              {showTitle && (
                <div className="modal-header">
                  <h3 className="modal-title uppercase">
                    {(action === "add" || action === "import") && (
                      <label>
                        {" "}
                        {action} new {name}
                      </label>
                    )}
                    {(action === "delete" || action === "edit") && (
                      <label>
                        Confirm {action} {name}
                      </label>
                    )}
                    {action === "view" && (
                      <label>
                        {action} {name}
                      </label>
                    )}
                    {action === "confirm" && <label>Confirm {name}</label>}
                  </h3>
                  <button
                    onClick={handleCancelClick}
                    className="close la la-times"
                  />
                </div>
              )}
              {/* min-h-body-${size} */}
              <div className={`modal-body min-h-body-${size} p-3`}>
                {action === "delete" && (
                  <div>
                    <h3>
                      <label>Are you sure want to delete this item?</label>
                    </h3>
                    <br />
                    <p>
                      <label>{content.Name}</label>
                    </p>
                  </div>
                )}
                {(action === "add" ||
                  action === "edit" ||
                  action === "import" ||
                  action === "view" ||
                  action === "confirm") &&
                  form}
              </div>
              {/* {showFooter && <div className="modal-footer">
                            <div className="flex ml-auto mr-auto">
                                <button
                                    type="button"
                                    className="btn btn_outlined btn_secondary ml-2 mr-2 uppercase"
                                    onClick={handleCancelClick}
                                >Close</button>
                            </div>
                        </div>} */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default CustomModal;
