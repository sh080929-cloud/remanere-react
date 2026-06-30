import "./Sidebar.css";
function Sidebar({ menu, handleClick }) {
  return (
    <aside className="sidebar">
      {menu.map((group) => (
        <div key={group.title} className="menu-group">

          <h4>{group.title}</h4>

          <ul>
            {group.items.map((item) => (
              <li
                key={item}
                onClick={() => handleClick(item)}
              >
                {item}
              </li>
            ))}
          </ul>

        </div>
      ))}
    </aside>
  );
}

export default Sidebar;