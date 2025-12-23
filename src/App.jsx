import { Route, Routes } from "react-router-dom";
import Main from "./modules/main/Main";
import Dashboard from "./pages/dashboard/Dashboard";
import MasterList from "./pages/master/MasterList";
import PublicRoute from "./routes/PublicRoute";
import VerifyPassword from "./modules/login/VerifyPassword";
import Employee from "./pages/master/employee/Employee";
import Area from "./pages/master/area/Area";
import Group from "./pages/master/group/Group";
import Receive from "./pages/receive/Receive";
import Issue from "./pages/issue/Issue";
import ReportDetail from "./pages/report/ReportDetail";
import ReportSumary from "./pages/report/ReportSumary";
import ItemStatus from "./pages/master/itemstatus/ItemStatus";
import Location from "./pages/master/location/Location";
import Unit from "./pages/master/unit/Unit";
import Warehouse from "./pages/master/warehouse/Warehouse";
import Simple from "./pages/simple/Simple";
import PrepareOrderLineAs from "./pages/prepareorderLineAs/PrepareOrderLineAs";
import ReportReceive from "./pages/report/ReportReceive";
import ReportIssue from "./pages/report/ReportIssue";
import IssueList from "./pages/issue/IssueList";
import IssueForm from "./pages/issue/IssueForm";
import ReceiveList from "./pages/receive/ReceiveList";
import ReceiveForm from "./pages/receive/ReceiveForm";
import ReportStock from "./pages/report/ReportStock";


function App() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<PublicRoute />}>
          <Route path="/login" element={<Dashboard />} />
        </Route>
        <Route path="/verifypassword" element={<PublicRoute />}>
          <Route path="/verifypassword" element={<VerifyPassword />} />
        </Route>
        {/* <Route path="/" element={<PrivateRoute />}> */}
        <Route path="/" element={<Main />}>
          <Route path="" element={<Receive />} />

          {/* <Route path="receive" element={<Receive />} /> */}
          <Route path="receive" element={<Receive />}>
            <Route index element={<ReceiveList />} />
            <Route path="new" element={<ReceiveForm />} />
            {/* <Route path="view/:id" element={<CarView />} /> */}
          </Route>


          {/* <Route path="issue" element={<Issue />} /> */}
          <Route path="issue" element={<Issue />}>
            <Route index element={<IssueList />} />
            <Route path="new" element={<IssueForm />} />
            {/* <Route path="view/:id" element={<CarView />} /> */}
          </Route>



          <Route path="simple" element={<Simple />} />
          <Route path="prepareorderlineas" element={<PrepareOrderLineAs />} />
          <Route path="reportreceive" element={<ReportReceive />} />
          <Route path="reportissue" element={<ReportIssue />} />
          <Route path="reportstock" element={<ReportStock />} />
          


          <Route path="Master" element={<MasterList />} />
          <Route path="employee" element={<Employee />} />
          <Route path="area" element={<Area />} />
          <Route path="group" element={<Group />} />
          <Route path="itemstatus" element={<ItemStatus />} />
          <Route path="location" element={<Location />} />
          <Route path="unit" element={<Unit />} />
          <Route path="warehouse" element={<Warehouse />} />






        </Route>
      </Routes>
    </div>
  );
}

export default App;
