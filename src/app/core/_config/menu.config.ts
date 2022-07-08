

export class MenuConfig {
  public defaults: any = {
    header: {
      self: {},
      items: [
        {
          title: 'Dashboards',
          root: true,
          alignment: 'left',
          page: '/dashboard',
          translate: 'MENU.DASHBOARD',
        },
        {
          title: 'test',
          root: true,
          alignment: 'left',
          page: 'mypage',
        },
        {
          title: 'Components',
          root: true,
          alignment: 'left',
          toggle: 'click',
          submenu: [
            {
              title: 'Google Material',
              bullet: 'dot',
              icon: 'flaticon-interface-7',
              submenu: [
                {
                  title: 'Form Controls',
                  bullet: 'dot',
                  submenu: [
                    {
                      title: 'Auto Complete',
                      page: '/material/form-controls/autocomplete',
                      permission: 'accessToECommerceModule'
                    },
                    {
                      title: 'Checkbox',
                      page: '/material/form-controls/checkbox'
                    },
                    {
                      title: 'Radio Button',
                      page: '/material/form-controls/radiobutton'
                    },
                    {
                      title: 'Datepicker',
                      page: '/material/form-controls/datepicker'
                    },
                    {
                      title: 'Form Field',
                      page: '/material/form-controls/formfield'
                    },
                    {
                      title: 'Input',
                      page: '/material/form-controls/input'
                    },
                    {
                      title: 'Select',
                      page: '/material/form-controls/select'
                    },
                    {
                      title: 'Slider',
                      page: '/material/form-controls/slider'
                    },
                    {
                      title: 'Slider Toggle',
                      page: '/material/form-controls/slidertoggle'
                    }
                  ]
                },
                {
                  title: 'Navigation',
                  bullet: 'dot',
                  submenu: [
                    {
                      title: 'Menu',
                      page: '/material/navigation/menu'
                    },
                    {
                      title: 'Sidenav',
                      page: '/material/navigation/sidenav'
                    },
                    {
                      title: 'Toolbar',
                      page: '/material/navigation/toolbar'
                    }
                  ]
                },
                {
                  title: 'Layout',
                  bullet: 'dot',
                  submenu: [
                    {
                      title: 'Card',
                      page: '/material/layout/card'
                    },
                    {
                      title: 'Divider',
                      page: '/material/layout/divider'
                    },
                    {
                      title: 'Expansion panel',
                      page: '/material/layout/expansion-panel'
                    },
                    {
                      title: 'Grid list',
                      page: '/material/layout/grid-list'
                    },
                    {
                      title: 'List',
                      page: '/material/layout/list'
                    },
                    {
                      title: 'Tabs',
                      page: '/material/layout/tabs'
                    },
                    {
                      title: 'Stepper',
                      page: '/material/layout/stepper'
                    },
                    {
                      title: 'Tree',
                      page: '/material/layout/tree'
                    }
                  ]
                },
                {
                  title: 'Buttons & Indicators',
                  bullet: 'dot',
                  submenu: [
                    {
                      title: 'Button',
                      page: '/material/buttons-and-indicators/button'
                    },
                    {
                      title: 'Button toggle',
                      page: '/material/buttons-and-indicators/button-toggle'
                    },
                    {
                      title: 'Chips',
                      page: '/material/buttons-and-indicators/chips'
                    },
                    {
                      title: 'Icon',
                      page: '/material/buttons-and-indicators/icon'
                    },
                    {
                      title: 'Progress bar',
                      page: '/material/buttons-and-indicators/progress-bar'
                    },
                    {
                      title: 'Progress spinner',
                      page: '/material/buttons-and-indicators/progress-spinner'
                    },
                    {
                      title: 'Ripples',
                      page: '/material/buttons-and-indicators/ripples'
                    }
                  ]
                },
                {
                  title: 'Popups & Modals',
                  bullet: 'dot',
                  submenu: [
                    {
                      title: 'Bottom sheet',
                      page: '/material/popups-and-modals/bottom-sheet'
                    },
                    {
                      title: 'Dialog',
                      page: '/material/popups-and-modals/dialog'
                    },
                    {
                      title: 'Snackbar',
                      page: '/material/popups-and-modals/snackbar'
                    },
                    {
                      title: 'Tooltip',
                      page: '/material/popups-and-modals/tooltip'
                    }
                  ]
                },
                {
                  title: 'Data table',
                  bullet: 'dot',
                  submenu: [
                    {
                      title: 'Paginator',
                      page: '/material/data-table/paginator'
                    },
                    {
                      title: 'Sort header',
                      page: '/material/data-table/sort-header'
                    },
                    {
                      title: 'Table',
                      page: '/material/data-table/table'
                    }
                  ]
                }
              ]
            },
            {
              title: 'Ng-Bootstrapppppppppppppppppppppppppppppppppppppp',
              bullet: 'dot',
              icon: 'flaticon-web',
              submenu: [
                {
                  title: 'Accordion',
                  page: '/ngbootstrap/accordion'
                },
                {
                  title: 'Alert',
                  page: '/ngbootstrap/alert'
                },
                {
                  title: 'Buttons',
                  page: '/ngbootstrap/buttons'
                },
                {
                  title: 'Carousel',
                  page: '/ngbootstrap/carousel'
                },
                {
                  title: 'Collapse',
                  page: '/ngbootstrap/collapse'
                },
                {
                  title: 'Datepicker',
                  page: '/ngbootstrap/datepicker'
                },
                {
                  title: 'Dropdown',
                  page: '/ngbootstrap/dropdown'
                },
                {
                  title: 'Modal',
                  page: '/ngbootstrap/modal'
                },
                {
                  title: 'Pagination',
                  page: '/ngbootstrap/pagination'
                },
                {
                  title: 'Popover',
                  page: '/ngbootstrap/popover'
                },
                {
                  title: 'Progressbar',
                  page: '/ngbootstrap/progressbar'
                },
                {
                  title: 'Rating',
                  page: '/ngbootstrap/rating'
                },
                {
                  title: 'Tabs',
                  page: '/ngbootstrap/tabs'
                },
                {
                  title: 'Timepicker',
                  page: '/ngbootstrap/timepicker'
                },
                {
                  title: 'Tooltips',
                  page: '/ngbootstrap/tooltip'
                },
                {
                  title: 'Typehead',
                  page: '/ngbootstrap/typehead'
                }
              ]
            },
          ]
        },
        {
          title: 'Applications',
          root: true,
          alignment: 'left',
          toggle: 'click',
          submenu: [
            {
              title: 'eCommerce',
              bullet: 'dot',
              icon: 'flaticon-business',
              permission: 'accessToECommerceModule',
              submenu: [
                {
                  title: 'Customers',
                  page: '/ecommerce/customers'
                },
                {
                  title: 'Products',
                  page: '/ecommerce/products'
                },
              ]
            },
            {
              title: 'User Management',
              bullet: 'dot',
              icon: 'flaticon-user',
              submenu: [
                {
                  title: 'Users',
                  page: '/user-management/users'
                },
                {
                  title: 'Roles',
                  page: '/user-management/roles'
                }
              ]
            },
          ]
        },
        {
          title: 'Custom',
          root: true,
          alignment: 'left',
          toggle: 'click',
          submenu: [
            {
              title: 'Error Pages',
              bullet: 'dot',
              icon: 'flaticon2-list-2',
              submenu: [
                {
                  title: 'Error 1',
                  page: '/error/error-1'
                },
                {
                  title: 'Error 2',
                  page: '/error/error-2'
                },
                {
                  title: 'Error 3',
                  page: '/error/error-3'
                },
                {
                  title: 'Error 4',
                  page: '/error/error-4'
                },
                {
                  title: 'Error 5',
                  page: '/error/error-5'
                },
                {
                  title: 'Error 6',
                  page: '/error/error-6'
                },
              ]
            },
            {
              title: 'Wizard',
              bullet: 'dot',
              icon: 'flaticon2-mail-1',
              submenu: [
                {
                  title: 'Wizard 1',
                  page: '/wizard/wizard-1'
                },
                {
                  title: 'Wizard 2',
                  page: '/wizard/wizard-2'
                },
                {
                  title: 'Wizard 3',
                  page: '/wizard/wizard-3'
                },
                {
                  title: 'Wizard 4',
                  page: '/wizard/wizard-4'
                },
              ]
            },
          ]
        },
      ]
    },
    aside: {
      self: {},
      items: [
        {
          title: 'Dashboard',  //Learning Menu
          root: true,
          forAdmin: true,
          forUser: true,
          icon: 'fas fa-tachometer-alt',
          page: '/dashboard',
          isEnabled : true,
          bullet: 'dot',
          submenu: [
            {
              title: 'School',
              bullet: 'dot',
              page: '/create/school-dashboard',
              role: 'school_dashboard',
              isEnabled: true,
            },
          ]
        },
        {
          title: 'Profile',  //Learning Menu
          root: true,
          forAdmin: true,
          forUser: true,
          isEnabled: true,
          icon: 'fas fa-address-card',
          page: '/dashboard',
          bullet: 'dot',
          submenu: [
            {
              title: 'Profile update',
              bullet: 'dot',
              page: '/view/profile-update',
              role: 'profile_update',
              isEnabled: true,
            },
          ]
        },
        {
          title: 'Learning',  //Learning Menu
          root: true,
          forAdmin: true,
          forUser: true,
          isEnabled: true,
          
          icon: 'fas fa-chalkboard',
          page: '/dashboard',
          // translate: 'MENU.DASHBOARD',
          bullet: 'dot',
          submenu: [
            {
              title: 'Mapping',
              bullet: 'dot',
              page: '/mapping',
              role: 'add_mapping',
              isEnabled: true,

            },
            {
              title: 'Sections',
              bullet: 'dot',
              page: '/create/section',
              role: 'add_section',
              isEnabled: true,
            },
            {
              title: 'Classes',
              bullet: 'dot',
              page: '/create/class',
              role: 'add_class',
              isEnabled: true,
            },
            {
              title: 'Board',
              bullet: 'dot',
              page: '/create/board',
              role: 'add_board',
              isEnabled: true,
            },
            {
              title: 'Syllabus',
              bullet: 'dot',
              page: '/create/syllabus',
              role: 'add_syllubus',
              isEnabled: true,
            },
            {
              title: 'Subjects',
              bullet: 'dot',
              page: '/create/subject',
              role: 'add_subject',
              isEnabled: true,
            },
            {
              title: 'Chapters',
              bullet: 'dot',
              page: '/create/chapter',
              role: 'add_chapter',
              isEnabled: true,
            },
            {
              title: 'Topics',
              bullet: 'dot',
              page: '/create/topic',
              role: 'add_topic',
              isEnabled: true,
            },
             {
               title: 'Learning Outcomes',
               bullet: 'dot',
              page: '/create/learning-outcome',
               role: 'add_learning_outcome',
               isEnabled: true,
             }, 
             {
              title: 'Question Category',
              bullet: 'dot',
              page: '/create/question-category',
               role: 'add_question_category',
               isEnabled: true,
             },
            {
              title: 'Exam Types',
              bullet: 'dot',
              page: '/create/exam-type',
              role: 'add_exam_types',
              isEnabled: true,
            },
          ]
        },

        { 
          title: 'Institution',
          root: true,
          forAdmin: true,
          forUser: true,
          isEnabled:true,
          icon: 'fas fa-university',
          page: '/role/add',
          bullet: 'dot',
          submenu: [
            {
              title: 'All Institutes',
              bullet: 'dot',
              page: '/create/all-institute',
              role: 'view_school',
              isEnabled: true,
            },
            {
              title: 'Add Institutes',
              bullet: 'dot',
              page: '/create/school',
              role: 'create_school',
              isEnabled: true,
            },

            {
              title: 'All Universities',
              bullet: 'dot',
              page: '/create/all-universities',
              role: 'view_school',
              isEnabled: false,
            },

          ]
        },
        {
          title: 'Students',
          root: true,
          forAdmin: true,
          forUser: true,
          icon: 'fas fa-user-graduate',
          page: '/role/add',
          bullet: 'dot',
          isEnabled: true,
          submenu: [
            {
              title: 'All Students ',
              bullet: 'dot',
              page: '/create/all-student',
              role: 'view_student',
              isEnabled: true,

            },
            {
              title: 'Enrol Students',
              bullet: 'dot',
              page: '/create/student',
              role: 'create_student',
              isEnabled: true,
            },
            {
              title: 'Promotion',
              bullet: 'dot',
              page: '/create/promotion',
              role: 'create_student',
              isEnabled: false,
            },
          ]
        },
        {
          title: 'Admissions',
          root: true,
          forAdmin: false,
          forUser: true,
          icon: 'fas fa-user-graduate',
          page: '/role/add',
          bullet: 'dot',
          isEnabled: false,
          submenu: [
            {
              title: 'All Admissions',
              bullet: 'dot',
              page: '/create/admissions',
              role: 'view_student',
              isEnabled: false,

            },
          ]
        },
        {
          title: 'Teachers',
          root: true,
          forAdmin: true,
          forUser: true,
          icon: 'fas fa-chalkboard-teacher',
          page: '/role/add',
          bullet: 'dot',
          isEnabled: true,
          submenu: [
            {
              title: 'All Teachers',
              bullet: 'dot',
              page: '/create/all-teacher',
              role: 'view_teacher',
              isEnabled: true,
            },
            {
              title: 'Add Teachers',
              bullet: 'dot',
              page: '/create/teacher',
              role: 'create_teacher',
              isEnabled: true,
            },

          ]
        },
        {
          title: 'Principal',
          root: true,
          forAdmin: true,
          forUser: true,
          icon: 'fas fa-user-tie',
          page: '/role/add',
          bullet: 'dot',
          isEnabled: true,
          submenu: [
            {
              title: 'All Principal',
              bullet: 'dot',
              page: '/create/all-principle',
              role: 'view_principle',
              isEnabled: true,
            },
            {
              title: 'Add Principal',
              bullet: 'dot',
              page: '/create/principle',
              role: 'create_principle',
              isEnabled: true,
            },

          ]
        },
        {
          title: 'Management',
          root: true,
          forAdmin: true,
          forUser: true,
          icon: 'fas fa-user-friends',
          page: '/role/add',
          bullet: 'dot',
          isEnabled: true,
          submenu: [
            {
              title: 'All Management',
              bullet: 'dot',
              page: '/create/all-management',
              role: 'view_management',
              isEnabled: true,
            },
            {
              title: 'Add Management',
              bullet: 'dot',
              page: '/create/management',
              role: 'create_management',
              isEnabled: true,
            },

          ]
        },

        {
          title: 'Roles & Permission',
          root: true,
          forAdmin: true,
          forUser: true,
          icon: 'fas fa-user-shield',
          page: '/role/add',
          bullet: 'dot',
          isEnabled: true,
          submenu: [
            {
              title: 'Add Role',
              bullet: 'dot',
              page: '/role/add',
              role: 'create_role',
              isEnabled: true,
            },
            {
              title: 'Assign Role',
              bullet: 'dot',
              page: '/role/assign',
              role: 'assign_role',
              isEnabled: true,
            },

          ]
        },
        {
          title: 'Questions',  //Learning Menu
          root: true,
          forAdmin: true,
          forUser: true,
          isEnabled: true,
          icon: 'fas fa-file-alt',
          page: '/view/questions',
          // translate: 'MENU.DASHBOARD',
          bullet: 'dot',
          submenu: [
            {
              title: 'Create Question',
              bullet: 'dot',
              page: '/create/question',
              role: 'create_question',
              isEnabled: true,
            },
            {
              title: 'Create Question Paper',
              bullet: 'dot',
              page: '/create/question-paper',
              role: 'create_question_paper',
              isEnabled: true,
            },
            {
              title: 'All Question Papers',
              bullet: 'dot',
              page: '/view/questionpapers',
              role: 'view_question_paper',
              isEnabled: true,
            },
            {
              title: 'All Questions',
              bullet: 'dot',
              page: '/view/questions',
              role: 'view_question',
              isEnabled: true,
            }
          ]
        },
        {
          title: 'Billing',
          root: true,
          forAdmin: false,
          forUser: true,
          icon: 'fas fa-user-graduate',
          page: '/create/payment',
          bullet: 'dot',
          isEnabled: true,
          submenu: [
            {
              title: 'Your Bills',
              bullet: 'dot',
              page: '/create/payment',
              role: 'view_student',
              isEnabled: true ,

            },
          ]
        },
        {
          title: 'Billing',
          root: true,
          forAdmin: true,
          forUser: false,
          icon: 'fas fa-user-graduate',
          page: '/create/payment',
          bullet: 'dot',
          isEnabled: true,
          submenu: [
            {
              title: 'Activate Billing',
              bullet: 'dot',
              page: '/create/activate-billing',
              isEnabled: true ,
            },
          ]
        },
        /* {
          title: 'Students', //Students Menu
          root: true,
          icon: 'flaticon2-architecture-and-city',
          page: '/dashboard',
          // translate: 'MENU.DASHBOARD',
          bullet: 'dot',
          submenu: [
            {
              title : 'All Students',
              bullet: 'dot',
              page: '/mypage'
            },
            {
              title : 'Enroll Students',
              bullet: 'dot',
              page: '/mypage'
            },
            {
              title : 'Parents / Gaurdian',
              bullet: 'dot',
              page: '/mypage'
            }
          ]
        }, */
        /* {
          title: 'Teachers', //Teachers Menu
          root: true,
          icon: 'flaticon2-architecture-and-city',
          page: '/dashboard',
          // translate: 'MENU.DASHBOARD',
          bullet: 'dot',
          submenu: [
            {
              title : 'All Teachers',
              bullet: 'dot',
              page: '/mypage'
            },
            {
              title : 'Enroll Students',
              bullet: 'dot',
              page: '/mypage'
            },
            {
              title : 'Parents / Gaurdian',
              bullet: 'dot',
              page: '/mypage'
            }
          ]
        }, */
        /* {
          title: 'test',
          root: true,
          alignment: 'left',
          page: '/test',
        },
        {
          title: 'Layout Builder',
          root: true,
          icon: 'flaticon2-expand',
          page: '/builder'
        },
        {section: 'Components'},
        {
          title: 'Google Material',
          root: true,
          bullet: 'dot',
          icon: 'flaticon2-browser-2',
          submenu: [
            {
              title: 'Form Controls',
              bullet: 'dot',
              submenu: [
                {
                  title: 'Auto Complete',
                  page: '/material/form-controls/autocomplete',
                  permission: 'accessToECommerceModule'
                },
                {
                  title: 'Checkbox',
                  page: '/material/form-controls/checkbox'
                },
                {
                  title: 'Radio Button',
                  page: '/material/form-controls/radiobutton'
                },
                {
                  title: 'Datepicker',
                  page: '/material/form-controls/datepicker'
                },
                {
                  title: 'Form Field',
                  page: '/material/form-controls/formfield'
                },
                {
                  title: 'Input',
                  page: '/material/form-controls/input'
                },
                {
                  title: 'Select',
                  page: '/material/form-controls/select'
                },
                {
                  title: 'Slider',
                  page: '/material/form-controls/slider'
                },
                {
                  title: 'Slider Toggle',
                  page: '/material/form-controls/slidertoggle'
                }
              ]
            },
            {
              title: 'Navigation',
              bullet: 'dot',
              submenu: [
                {
                  title: 'Menu',
                  page: '/material/navigation/menu'
                },
                {
                  title: 'Sidenav',
                  page: '/material/navigation/sidenav'
                },
                {
                  title: 'Toolbar',
                  page: '/material/navigation/toolbar'
                }
              ]
            },
            {
              title: 'Layout',
              bullet: 'dot',
              submenu: [
                {
                  title: 'Card',
                  page: '/material/layout/card'
                },
                {
                  title: 'Divider',
                  page: '/material/layout/divider'
                },
                {
                  title: 'Expansion panel',
                  page: '/material/layout/expansion-panel'
                },
                {
                  title: 'Grid list',
                  page: '/material/layout/grid-list'
                },
                {
                  title: 'List',
                  page: '/material/layout/list'
                },
                {
                  title: 'Tabs',
                  page: '/material/layout/tabs'
                },
                {
                  title: 'Stepper',
                  page: '/material/layout/stepper'
                },
                {
                  title: 'Tree',
                  page: '/material/layout/tree'
                }
              ]
            },
            {
              title: 'Buttons & Indicators',
              bullet: 'dot',
              submenu: [
                {
                  title: 'Button',
                  page: '/material/buttons-and-indicators/button'
                },
                {
                  title: 'Button toggle',
                  page: '/material/buttons-and-indicators/button-toggle'
                },
                {
                  title: 'Chips',
                  page: '/material/buttons-and-indicators/chips'
                },
                {
                  title: 'Icon',
                  page: '/material/buttons-and-indicators/icon'
                },
                {
                  title: 'Progress bar',
                  page: '/material/buttons-and-indicators/progress-bar'
                },
                {
                  title: 'Progress spinner',
                  page: '/material/buttons-and-indicators/progress-spinner'
                },
                {
                  title: 'Ripples',
                  page: '/material/buttons-and-indicators/ripples'
                }
              ]
            },
            {
              title: 'Popups & Modals',
              bullet: 'dot',
              submenu: [
                {
                  title: 'Bottom sheet',
                  page: '/material/popups-and-modals/bottom-sheet'
                },
                {
                  title: 'Dialog',
                  page: '/material/popups-and-modals/dialog'
                },
                {
                  title: 'Snackbar',
                  page: '/material/popups-and-modals/snackbar'
                },
                {
                  title: 'Tooltip',
                  page: '/material/popups-and-modals/tooltip'
                }
              ]
            },
            {
              title: 'Data table',
              bullet: 'dot',
              submenu: [
                {
                  title: 'Paginator',
                  page: '/material/data-table/paginator'
                },
                {
                  title: 'Sort header',
                  page: '/material/data-table/sort-header'
                },
                {
                  title: 'Table',
                  page: '/material/data-table/table'
                }
              ]
            }
          ]
        }, */
        /* {
          title: 'Ng-Bootstrap',
          root: true,
          bullet: 'dot',
          icon: 'flaticon2-digital-marketing',
          submenu: [
            {
              title: 'Accordion',
              page: '/ngbootstrap/accordion'
            },
            {
              title: 'Alert',
              page: '/ngbootstrap/alert'
            },
            {
              title: 'Buttons',
              page: '/ngbootstrap/buttons'
            },
            {
              title: 'Carousel',
              page: '/ngbootstrap/carousel'
            },
            {
              title: 'Collapse',
              page: '/ngbootstrap/collapse'
            },
            {
              title: 'Datepicker',
              page: '/ngbootstrap/datepicker'
            },
            {
              title: 'Dropdown',
              page: '/ngbootstrap/dropdown'
            },
            {
              title: 'Modal',
              page: '/ngbootstrap/modal'
            },
            {
              title: 'Pagination',
              page: '/ngbootstrap/pagination'
            },
            {
              title: 'Popover',
              page: '/ngbootstrap/popover'
            },
            {
              title: 'Progressbar',
              page: '/ngbootstrap/progressbar'
            },
            {
              title: 'Rating',
              page: '/ngbootstrap/rating'
            },
            {
              title: 'Tabs',
              page: '/ngbootstrap/tabs'
            },
            {
              title: 'Timepicker',
              page: '/ngbootstrap/timepicker'
            },
            {
              title: 'Tooltips',
              page: '/ngbootstrap/tooltip'
            },
            {
              title: 'Typehead',
              page: '/ngbootstrap/typehead'
            }
          ]
        }, */
        /* {section: 'Applications'},
        {
          title: 'eCommerce',
          bullet: 'dot',
          icon: 'flaticon2-list-2',
          root: true,
          permission: 'accessToECommerceModule',
          submenu: [
            {
              title: 'Customers',
              page: '/ecommerce/customers'
            },
            {
              title: 'Products',
              page: '/ecommerce/products'
            },
          ]
        }, */
        /* {
          title: 'User Management',
          root: true,
          bullet: 'dot',
          icon: 'flaticon2-user-outline-symbol',
          submenu: [
            {
              title: 'Users',
              page: '/user-management/users'
            },
            {
              title: 'Roles',
              page: '/user-management/roles'
            }
          ]
        }, */
        /* {section: 'Custom'},
        {
          title: 'Error Pages',
          root: true,
          bullet: 'dot',
          icon: 'flaticon2-list-2',
          submenu: [
            {
              title: 'Error 1',
              page: '/error/error-1'
            },
            {
              title: 'Error 2',
              page: '/error/error-2'
            },
            {
              title: 'Error 3',
              page: '/error/error-3'
            },
            {
              title: 'Error 4',
              page: '/error/error-4'
            },
            {
              title: 'Error 5',
              page: '/error/error-5'
            },
            {
              title: 'Error 6',
              page: '/error/error-6'
            },
          ]
        }, */
        /* {
          title: 'Wizard',
          root: true,
          bullet: 'dot',
          icon: 'flaticon2-mail-1',
          submenu: [
            {
              title: 'Wizard 1',
              page: '/wizard/wizard-1'
            },
            {
              title: 'Wizard 2',
              page: '/wizard/wizard-2'
            },
            {
              title: 'Wizard 3',
              page: '/wizard/wizard-3'
            },
            {
              title: 'Wizard 4',
              page: '/wizard/wizard-4'
            },
          ]
        }, */
      ]
    },
  };

  public get configs(): any {
    return this.defaults;
  }
}