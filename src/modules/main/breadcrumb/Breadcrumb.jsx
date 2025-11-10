const Breadcrumb = ({ home, title, showSection = true }) => {
  return (
    <div>
      <h2>{title}</h2>
      {showSection &&
        <ul className="mt-0 mr-1">
          <li className="font-bold">
            <a href={home}>{home}</a>
          </li>
          <li className="divider la la-arrow-right"></li>
          <li>{title}</li>
        </ul>
      }
    </div>
  );
};

export default Breadcrumb;
