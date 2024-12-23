import MenuLink from "./MenuLink";
import {
  MdDashboard,
  MdSupervisedUserCircle,
  MdWork,
  MdAnalytics,
  MdPeople,
} from "react-icons/md";
import { FaChalkboardTeacher, FaUserGraduate, FaUserFriends } from "react-icons/fa";
import { PiExamFill, PiChalkboardTeacherFill } from "react-icons/pi";
import { IoSchool } from "react-icons/io5";
import { GiTeacher } from "react-icons/gi";
import { BsCalendar2EventFill } from "react-icons/bs";

const menuItems = [
  {
    title: "Pages",
    list: [
      {
        title: "Accueil",
        path: "/",
        icon: <MdDashboard />,
      },
    ],
  },
  {
    title: "Utilisateurs",
    list: [
      {
        title: "Enseignants",
        path: "/list/teachers",
        icon: <FaChalkboardTeacher />,
      },
      {
        title: "Élèves",
        path: "/list/students",
        icon: <FaUserGraduate />,
      },
      {
        title: "Parents",
        path: "/list/parents",
        icon: <FaUserFriends />,
      },
    ],
  },
  {
    title: "Académique",
    list: [
      {
        title: "Matières",
        path: "/list/subjects",
        icon: <IoSchool />,
      },
      {
        title: "Classes",
        path: "/list/classes",
        icon: <PiChalkboardTeacherFill />,
      },
      {
        title: "Leçons",
        path: "/list/lessons",
        icon: <GiTeacher />,
      },
    ],
  },
  {
    title: "Évaluations",
    list: [
      {
        title: "Examens",
        path: "/list/exams",
        icon: <PiExamFill />,
      },
      {
        title: "Devoirs",
        path: "/list/assignments",
        icon: <MdWork />,
      },
      {
        title: "Résultats",
        path: "/list/results",
        icon: <MdAnalytics />,
      },
    ],
  },
  {
    title: "Gestion",
    list: [
      {
        title: "Présences",
        path: "/list/attendance",
        icon: <MdPeople />,
      },
      {
        title: "Événements",
        path: "/list/events",
        icon: <BsCalendar2EventFill />,
      },
      {
        title: "Annonces",
        path: "/list/announcements",
        icon: <MdSupervisedUserCircle />,
      },
    ],
  },
];

const Menu = () => {
  return (
    <div className="container px-4">
      {menuItems.map((cat) => (
        <div key={cat.title} className="mb-8">
          <span className="text-xs font-bold text-gray-400 mb-2 block">
            {cat.title}
          </span>
          {cat.list.map((item) => (
            <MenuLink item={item} key={item.title} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Menu;
