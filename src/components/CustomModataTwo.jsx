import React from "react";
import PropTypes from "prop-types";

const CustomModalTwo = ({
  size = "medium",
  show,
  form,
  handleCancelClick,
  showTitle = true,
  title = "Modal Title",
  showClose = true,
}) => {
  const sizeClasses = {
    small: "w-full sm:w-1/2 lg:w-1/3",
    medium: "w-full sm:w-2/3 lg:w-1/2",
    large: "w-full sm:w-3/4 lg:w-2/3",
    full: "fixed inset-0 w-screen h-screen max-w-none max-h-none overflow-hidden",
  };

  return (
    <>
      {show && (
        <div
          id="modal"
          className="fixed inset-0 flex items-center justify-center z-50"
        >
          <div
            className={`bg-white rounded-lg shadow-lg overflow-hidden ${sizeClasses[size] || sizeClasses.medium
              }`}
          >
            {/* Modal Header */}
            {showTitle && (
              <div className="flex justify-between items-center border-b p-4">
                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold">
                  {title.toUpperCase()}
                </h3>
                {showClose && (
                  <button
                    className="close la la-times text-2xl"
                    onClick={handleCancelClick}
                  ></button>
                )}
              </div>
            )}

            {/* Modal Content */}
            <div className="p-4 overflow-y-auto h-full">
              {form && <div>{form}</div>}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

CustomModalTwo.propTypes = {
  size: PropTypes.oneOf(["small", "medium", "large", "full"]),
  show: PropTypes.bool,
  form: PropTypes.node,
  handleCancelClick: PropTypes.func.isRequired,
  showTitle: PropTypes.bool,
  title: PropTypes.string,
  showClose: PropTypes.bool,
};

export default CustomModalTwo;
