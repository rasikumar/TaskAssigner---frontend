import {
  GiHumanPyramid,
  GiWireframeGlobe,
  GiPieChart,
  GiBugNet,
} from "react-icons/gi";

export const teams = [
  {
    name: "Design",
    description: "Handles UI/UX designs and creative tasks.",
    icon: GiWireframeGlobe,
    roles: [
      {
        name: "Manager",
        tasksFinished: 10,
        tasksPending: 3,
        totalPeople: 3,
        tasksDetails: "Designs UI/UX for products",
        members: [
          {
            id: 1,
            name: "Alice Johnson",
            email: "alice.johnson@example.com",
            profile: "https://example.com/profiles/alice",
            tasks: [
              { id: 1, title: "Redesign Homepage", status: "Completed" },
              { id: 2, title: "App Prototype", status: "In Progress" },
            ],
          },
          {
            id: 2,
            name: "Bob Smith",
            email: "bob.smith@example.com",
            profile: "https://example.com/profiles/bob",
            tasks: [
              { id: 1, title: "Brand Style Guide", status: "Completed" },
              { id: 2, title: "UI Audit", status: "Pending" },
            ],
          },
          {
            id: 3,
            name: "Charlie Davis",
            email: "charlie.davis@example.com",
            profile: "https://example.com/profiles/charlie",
            tasks: [
              { id: 1, title: "Icon Set Design", status: "Completed" },
              { id: 2, title: "Dashboard Mockup", status: "Pending" },
            ],
          },
        ],
      },
      {
        name: "Team Leader",
        tasksFinished: 15,
        tasksPending: 2,
        totalPeople: 3,
        tasksDetails: "Leads design team tasks",
      },
      {
        name: "Members",
        tasksFinished: 25,
        tasksPending: 7,
        totalPeople: 30,
        tasksDetails: "Works on individual design tasks",
      },
      {
        name: "Interns",
        tasksFinished: 8,
        tasksPending: 5,
        totalPeople: 2,
        tasksDetails: "Handles team recruitment and relations",
      },
    ],
    totalTasksFinished: 58, // Total of tasksFinished for all roles
    totalTasksPending: 17, // Total of tasksPending for all roles
  },
  {
    name: "Development",
    description: "Responsible for coding and software development.",
    icon: GiPieChart,
    roles: [
      {
        name: "Manager",
        tasksFinished: 12,
        tasksPending: 4,
        totalPeople: 3,
        tasksDetails: "Oversees the development team's progress",
        members: [
          {
            id: 1,
            name: "Alice Johnson",
            email: "alice.johnson@example.com",
            profile: "https://example.com/profiles/alice",
            tasks: [
              { id: 1, title: "Redesign Homepage", status: "Completed" },
              { id: 2, title: "App Prototype", status: "In Progress" },
            ],
          },
          {
            id: 2,
            name: "Bob Smith",
            email: "bob.smith@example.com",
            profile: "https://example.com/profiles/bob",
            tasks: [
              { id: 1, title: "Brand Style Guide", status: "Completed" },
              { id: 2, title: "UI Audit", status: "Pending" },
            ],
          },
          {
            id: 3,
            name: "Charlie Davis",
            email: "charlie.davis@example.com",
            profile: "https://example.com/profiles/charlie",
            tasks: [
              { id: 1, title: "Icon Set Design", status: "Completed" },
              { id: 2, title: "Dashboard Mockup", status: "Pending" },
            ],
          },
        ],
      },
      {
        name: "Team Leader",
        tasksFinished: 18,
        tasksPending: 6,
        totalPeople: 4,
        tasksDetails: "Guides the development process",
        members: [
          {
            id: 1,
            name: "Alice Johnson",
            email: "alice.johnson@example.com",
            profile: "https://example.com/profiles/alice",
            tasks: [
              { id: 1, title: "Redesign Homepage", status: "Completed" },
              { id: 2, title: "App Prototype", status: "In Progress" },
            ],
          },
          {
            id: 2,
            name: "Bob Smith",
            email: "bob.smith@example.com",
            profile: "https://example.com/profiles/bob",
            tasks: [
              { id: 1, title: "Brand Style Guide", status: "Completed" },
              { id: 2, title: "UI Audit", status: "Pending" },
            ],
          },
          {
            id: 3,
            name: "Charlie Davis",
            email: "charlie.davis@example.com",
            profile: "https://example.com/profiles/charlie",
            tasks: [
              { id: 1, title: "Icon Set Design", status: "Completed" },
              { id: 2, title: "Dashboard Mockup", status: "Pending" },
            ],
          },
        ],
      },
      {
        name: "Members",
        tasksFinished: 50,
        tasksPending: 10,
        totalPeople: 20,
        tasksDetails: "Develops and codes software",
        members: [
          {
            id: 1,
            name: "Alice Johnson",
            email: "alice.johnson@example.com",
            profile: "https://example.com/profiles/alice",
            tasks: [
              { id: 1, title: "Redesign Homepage", status: "Completed" },
              { id: 2, title: "App Prototype", status: "In Progress" },
            ],
          },
          {
            id: 2,
            name: "Bob Smith",
            email: "bob.smith@example.com",
            profile: "https://example.com/profiles/bob",
            tasks: [
              { id: 1, title: "Brand Style Guide", status: "Completed" },
              { id: 2, title: "UI Audit", status: "Pending" },
            ],
          },
          {
            id: 3,
            name: "Charlie Davis",
            email: "charlie.davis@example.com",
            profile: "https://example.com/profiles/charlie",
            tasks: [
              { id: 1, title: "Icon Set Design", status: "Completed" },
              { id: 2, title: "Dashboard Mockup", status: "Pending" },
            ],
          },
        ],
      },
      {
        name: "Interns",
        tasksFinished: 9,
        tasksPending: 3,
        totalPeople: 2,
        tasksDetails: "Manages recruitment and team welfare",
        members: [
          {
            id: 1,
            name: "Alice Johnson",
            email: "alice.johnson@example.com",
            profile: "https://example.com/profiles/alice",
            tasks: [
              { id: 1, title: "Redesign Homepage", status: "Completed" },
              { id: 2, title: "App Prototype", status: "In Progress" },
            ],
          },
          {
            id: 2,
            name: "Bob Smith",
            email: "bob.smith@example.com",
            profile: "https://example.com/profiles/bob",
            tasks: [
              { id: 1, title: "Brand Style Guide", status: "Completed" },
              { id: 2, title: "UI Audit", status: "Pending" },
            ],
          },
          {
            id: 3,
            name: "Charlie Davis",
            email: "charlie.davis@example.com",
            profile: "https://example.com/profiles/charlie",
            tasks: [
              { id: 1, title: "Icon Set Design", status: "Completed" },
              { id: 2, title: "Dashboard Mockup", status: "Pending" },
            ],
          },
        ],
      },
    ],
    totalTasksFinished: 89, // Total of tasksFinished for all roles
    totalTasksPending: 23, // Total of tasksPending for all roles
  },
  {
    name: "Marketing",
    description: "Focuses on promoting products and strategies.",
    icon: GiHumanPyramid,
    roles: [
      {
        name: "Manager",
        tasksFinished: 6,
        tasksPending: 2,
        totalPeople: 3,
        tasksDetails: "Manages marketing campaigns",
        members: [
          {
            id: 1,
            name: "Alice Johnson",
            email: "alice.johnson@example.com",
            profile: "https://example.com/profiles/alice",
            tasks: [
              { id: 1, title: "Redesign Homepage", status: "Completed" },
              { id: 2, title: "App Prototype", status: "In Progress" },
            ],
          },
          {
            id: 2,
            name: "Bob Smith",
            email: "bob.smith@example.com",
            profile: "https://example.com/profiles/bob",
            tasks: [
              { id: 1, title: "Brand Style Guide", status: "Completed" },
              { id: 2, title: "UI Audit", status: "Pending" },
            ],
          },
          {
            id: 3,
            name: "Charlie Davis",
            email: "charlie.davis@example.com",
            profile: "https://example.com/profiles/charlie",
            tasks: [
              { id: 1, title: "Icon Set Design", status: "Completed" },
              { id: 2, title: "Dashboard Mockup", status: "Pending" },
            ],
          },
        ],
      },

      {
        name: "Team Leader",
        tasksFinished: 10,
        tasksPending: 3,
        totalPeople: 3,
        tasksDetails: "Leads marketing strategies",
        members: [
          {
            id: 1,
            name: "Alice Johnson",
            email: "alice.johnson@example.com",
            profile: "https://example.com/profiles/alice",
            tasks: [
              { id: 1, title: "Redesign Homepage", status: "Completed" },
              { id: 2, title: "App Prototype", status: "In Progress" },
            ],
          },
          {
            id: 2,
            name: "Bob Smith",
            email: "bob.smith@example.com",
            profile: "https://example.com/profiles/bob",
            tasks: [
              { id: 1, title: "Brand Style Guide", status: "Completed" },
              { id: 2, title: "UI Audit", status: "Pending" },
            ],
          },
          {
            id: 3,
            name: "Charlie Davis",
            email: "charlie.davis@example.com",
            profile: "https://example.com/profiles/charlie",
            tasks: [
              { id: 1, title: "Icon Set Design", status: "Completed" },
              { id: 2, title: "Dashboard Mockup", status: "Pending" },
            ],
          },
        ],
      },
      {
        name: "Members",
        tasksFinished: 20,
        tasksPending: 5,
        totalPeople: 20,
        tasksDetails: "Executes marketing campaigns",
        members: [
          {
            id: 1,
            name: "Alice Johnson",
            email: "alice.johnson@example.com",
            profile: "https://example.com/profiles/alice",
            tasks: [
              { id: 1, title: "Redesign Homepage", status: "Completed" },
              { id: 2, title: "App Prototype", status: "In Progress" },
            ],
          },
          {
            id: 2,
            name: "Bob Smith",
            email: "bob.smith@example.com",
            profile: "https://example.com/profiles/bob",
            tasks: [
              { id: 1, title: "Brand Style Guide", status: "Completed" },
              { id: 2, title: "UI Audit", status: "Pending" },
            ],
          },
          {
            id: 3,
            name: "Charlie Davis",
            email: "charlie.davis@example.com",
            profile: "https://example.com/profiles/charlie",
            tasks: [
              { id: 1, title: "Icon Set Design", status: "Completed" },
              { id: 2, title: "Dashboard Mockup", status: "Pending" },
            ],
          },
        ],
      },
      {
        name: "Interns",
        tasksFinished: 5,
        tasksPending: 1,
        totalPeople: 1,
        tasksDetails: "Handles marketing team recruitment",
        members: [
          {
            id: 1,
            name: "Alice Johnson",
            email: "alice.johnson@example.com",
            profile: "https://example.com/profiles/alice",
            tasks: [
              { id: 1, title: "Redesign Homepage", status: "Completed" },
              { id: 2, title: "App Prototype", status: "In Progress" },
            ],
          },
          {
            id: 2,
            name: "Bob Smith",
            email: "bob.smith@example.com",
            profile: "https://example.com/profiles/bob",
            tasks: [
              { id: 1, title: "Brand Style Guide", status: "Completed" },
              { id: 2, title: "UI Audit", status: "Pending" },
            ],
          },
          {
            id: 3,
            name: "Charlie Davis",
            email: "charlie.davis@example.com",
            profile: "https://example.com/profiles/charlie",
            tasks: [
              { id: 1, title: "Icon Set Design", status: "Completed" },
              { id: 2, title: "Dashboard Mockup", status: "Pending" },
            ],
          },
        ],
      },
    ],
    totalTasksFinished: 41, // Total of tasksFinished for all roles
    totalTasksPending: 11, // Total of tasksPending for all roles
  },
  {
    name: "Testing",
    description: "Ensures software quality and bug fixes.",
    icon: GiBugNet,
    roles: [
      {
        name: "Manager",
        tasksFinished: 9,
        tasksPending: 2,
        totalPeople: 2,
        tasksDetails: "Manages testing projects",
        members: [
          {
            id: 1,
            name: "Alice Johnson",
            email: "alice.johnson@example.com",
            profile: "https://example.com/profiles/alice",
            tasks: [
              { id: 1, title: "Redesign Homepage", status: "Completed" },
              { id: 2, title: "App Prototype", status: "In Progress" },
            ],
          },
          {
            id: 2,
            name: "Bob Smith",
            email: "bob.smith@example.com",
            profile: "https://example.com/profiles/bob",
            tasks: [
              { id: 1, title: "Brand Style Guide", status: "Completed" },
              { id: 2, title: "UI Audit", status: "Pending" },
            ],
          },
          {
            id: 3,
            name: "Charlie Davis",
            email: "charlie.davis@example.com",
            profile: "https://example.com/profiles/charlie",
            tasks: [
              { id: 1, title: "Icon Set Design", status: "Completed" },
              { id: 2, title: "Dashboard Mockup", status: "Pending" },
            ],
          },
        ],
      },

      {
        name: "Team Leader",
        tasksFinished: 12,
        tasksPending: 3,
        totalPeople: 3,
        tasksDetails: "Leads bug testing and fixes",
        members: [
          {
            id: 1,
            name: "Alice Johnson",
            email: "alice.johnson@example.com",
            profile: "https://example.com/profiles/alice",
            tasks: [
              { id: 1, title: "Redesign Homepage", status: "Completed" },
              { id: 2, title: "App Prototype", status: "In Progress" },
            ],
          },
          {
            id: 2,
            name: "Bob Smith",
            email: "bob.smith@example.com",
            profile: "https://example.com/profiles/bob",
            tasks: [
              { id: 1, title: "Brand Style Guide", status: "Completed" },
              { id: 2, title: "UI Audit", status: "Pending" },
            ],
          },
          {
            id: 3,
            name: "Charlie Davis",
            email: "charlie.davis@example.com",
            profile: "https://example.com/profiles/charlie",
            tasks: [
              { id: 1, title: "Icon Set Design", status: "Completed" },
              { id: 2, title: "Dashboard Mockup", status: "Pending" },
            ],
          },
        ],
      },
      {
        name: "Members",
        tasksFinished: 35,
        tasksPending: 7,
        totalPeople: 10,
        tasksDetails: "Performs bug testing and fixes",
        members: [
          {
            id: 1,
            name: "Alice Johnson",
            email: "alice.johnson@example.com",
            profile: "https://example.com/profiles/alice",
            tasks: [
              { id: 1, title: "Redesign Homepage", status: "Completed" },
              { id: 2, title: "App Prototype", status: "In Progress" },
            ],
          },
          {
            id: 2,
            name: "Bob Smith",
            email: "bob.smith@example.com",
            profile: "https://example.com/profiles/bob",
            tasks: [
              { id: 1, title: "Brand Style Guide", status: "Completed" },
              { id: 2, title: "UI Audit", status: "Pending" },
            ],
          },
          {
            id: 3,
            name: "Charlie Davis",
            email: "charlie.davis@example.com",
            profile: "https://example.com/profiles/charlie",
            tasks: [
              { id: 1, title: "Icon Set Design", status: "Completed" },
              { id: 2, title: "Dashboard Mockup", status: "Pending" },
            ],
          },
        ],
      },
      {
        name: "Interns",
        tasksFinished: 4,
        tasksPending: 1,
        totalPeople: 1,
        tasksDetails: "Manages HR tasks in testing team",
        members: [
          {
            id: 1,
            name: "Alice Johnson",
            email: "alice.johnson@example.com",
            profile: "https://example.com/profiles/alice",
            tasks: [
              { id: 1, title: "Redesign Homepage", status: "Completed" },
              { id: 2, title: "App Prototype", status: "In Progress" },
            ],
          },
          {
            id: 2,
            name: "Bob Smith",
            email: "bob.smith@example.com",
            profile: "https://example.com/profiles/bob",
            tasks: [
              { id: 1, title: "Brand Style Guide", status: "Completed" },
              { id: 2, title: "UI Audit", status: "Pending" },
            ],
          },
          {
            id: 3,
            name: "Charlie Davis",
            email: "charlie.davis@example.com",
            profile: "https://example.com/profiles/charlie",
            tasks: [
              { id: 1, title: "Icon Set Design", status: "Completed" },
              { id: 2, title: "Dashboard Mockup", status: "Pending" },
            ],
          },
        ],
      },
    ],
    totalTasksFinished: 60, // Total of tasksFinished for all roles
    totalTasksPending: 13, // Total of tasksPending for all roles
  },
  {
    name: "Human Resource",
    description: "Handles recruitment and employee relations.",
    icon: GiHumanPyramid,
    roles: [
      {
        name: "HR Manager",
        tasksFinished: 8,
        tasksPending: 2,
        totalPeople: 3,
        tasksDetails: "Manages recruitment and HR activities",
        members: [
          {
            id: 1,
            name: "Alice Johnson",
            email: "alice.johnson@example.com",
            profile: "https://example.com/profiles/alice",
            tasks: [
              { id: 1, title: "Redesign Homepage", status: "Completed" },
              { id: 2, title: "App Prototype", status: "In Progress" },
            ],
          },
          {
            id: 2,
            name: "Bob Smith",
            email: "bob.smith@example.com",
            profile: "https://example.com/profiles/bob",
            tasks: [
              { id: 1, title: "Brand Style Guide", status: "Completed" },
              { id: 2, title: "UI Audit", status: "Pending" },
            ],
          },
          {
            id: 3,
            name: "Charlie Davis",
            email: "charlie.davis@example.com",
            profile: "https://example.com/profiles/charlie",
            tasks: [
              { id: 1, title: "Icon Set Design", status: "Completed" },
              { id: 2, title: "Dashboard Mockup", status: "Pending" },
            ],
          },
        ],
      },
      {
        name: "HR Executive",
        tasksFinished: 12,
        tasksPending: 1,
        totalPeople: 5,
        tasksDetails: "Handles employee relations and wellbeing",
        members: [
          {
            id: 1,
            name: "Alice Johnson",
            email: "alice.johnson@example.com",
            profile: "https://example.com/profiles/alice",
            tasks: [
              { id: 1, title: "Redesign Homepage", status: "Completed" },
              { id: 2, title: "App Prototype", status: "In Progress" },
            ],
          },
          {
            id: 2,
            name: "Bob Smith",
            email: "bob.smith@example.com",
            profile: "https://example.com/profiles/bob",
            tasks: [
              { id: 1, title: "Brand Style Guide", status: "Completed" },
              { id: 2, title: "UI Audit", status: "Pending" },
            ],
          },
          {
            id: 3,
            name: "Charlie Davis",
            email: "charlie.davis@example.com",
            profile: "https://example.com/profiles/charlie",
            tasks: [
              { id: 1, title: "Icon Set Design", status: "Completed" },
              { id: 2, title: "Dashboard Mockup", status: "Pending" },
            ],
          },
        ],
      },
      {
        name: "HR Interns",
        tasksFinished: 5,
        tasksPending: 0,
        totalPeople: 2,
        tasksDetails: "Leads HR operations",
        members: [
          {
            id: 1,
            name: "Alice Johnson",
            email: "alice.johnson@example.com",
            profile: "https://example.com/profiles/alice",
            tasks: [
              { id: 1, title: "Redesign Homepage", status: "Completed" },
              { id: 2, title: "App Prototype", status: "In Progress" },
            ],
          },
          {
            id: 2,
            name: "Bob Smith",
            email: "bob.smith@example.com",
            profile: "https://example.com/profiles/bob",
            tasks: [
              { id: 1, title: "Brand Style Guide", status: "Completed" },
              { id: 2, title: "UI Audit", status: "Pending" },
            ],
          },
          {
            id: 3,
            name: "Charlie Davis",
            email: "charlie.davis@example.com",
            profile: "https://example.com/profiles/charlie",
            tasks: [
              { id: 1, title: "Icon Set Design", status: "Completed" },
              { id: 2, title: "Dashboard Mockup", status: "Pending" },
            ],
          },
        ],
      },
      // {
      //   name: "Members",
      //   tasksFinished: 18,
      //   tasksPending: 3,
      //   totalPeople: 10,
      //   tasksDetails: "Assists with recruitment and employee services",
      //   members: [
      //     {
      //       id: 1,
      //       name: "Alice Johnson",
      //       email: "alice.johnson@example.com",
      //       profile: "https://example.com/profiles/alice",
      //       tasks: [
      //         { id: 1, title: "Redesign Homepage", status: "Completed" },
      //         { id: 2, title: "App Prototype", status: "In Progress" },
      //       ],
      //     },
      //     {
      //       id: 2,
      //       name: "Bob Smith",
      //       email: "bob.smith@example.com",
      //       profile: "https://example.com/profiles/bob",
      //       tasks: [
      //         { id: 1, title: "Brand Style Guide", status: "Completed" },
      //         { id: 2, title: "UI Audit", status: "Pending" },
      //       ],
      //     },
      //     {
      //       id: 3,
      //       name: "Charlie Davis",
      //       email: "charlie.davis@example.com",
      //       profile: "https://example.com/profiles/charlie",
      //       tasks: [
      //         { id: 1, title: "Icon Set Design", status: "Completed" },
      //         { id: 2, title: "Dashboard Mockup", status: "Pending" },
      //       ],
      //     },
      //   ],
      // },
    ],
    totalTasksFinished: 43, // Total of tasksFinished for all roles
    totalTasksPending: 6, // Total of tasksPending for all roles
  },
];
