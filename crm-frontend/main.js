(async () => {

  // Флаги, массивы
  let contactsList = []
  let modalFlag = true;
  let sortColumnFlag = 'id';
  let sortDirFlag = true;
  let editClientID;
  let clientsList = [];
  const SERVER_URL = 'http://localhost:3000'

  // Создаем шапку таблицы
  const $tHead = document.getElementById('thead')
  const $theadID = document.getElementById('thead-id')
  const $theadSNL = document.getElementById('thead-snl')
  const $theadCreatedAt = document.getElementById('thead-created')
  const $theadChangeAt = document.getElementById('thead-change-at')
  const $filterInput = document.getElementById('header-search')
  let timer;
  $filterInput.addEventListener('input', async function () {
    clearTimeout(timer)
    timer = setTimeout(async function () {
      let response = await fetch(SERVER_URL + `/api/clients?search=${$filterInput.value}`)
      let filtredClients = await response.json()
      clientsList = filtredClients;
      render(clientsList)
    }, 3000
    )
  })


  // Восстанавливаем после перезагрузки страницы
  let serverClientsData = await getClientsListServer()
  if (serverClientsData !== null) {
    clientsList = [...serverClientsData];
  }

  // Функция удаления контакта с сервера
  async function deleteClientstServer(id) {
    await fetch(SERVER_URL + '/api/clients/' + id, {
      method: 'DELETE',
    })
  }

  const $appMain = document.getElementById('app-main')
  const $mainTable = document.getElementById('app__table')

  const $tBody = document.getElementById('tbody')


  const $modal = document.getElementById('modal')

  // Создаем форму добавления клиента
  const $clientForm = document.createElement('form')
  $clientForm.classList.add('act-form')
  // Элементы
  const $inputsContainer = document.createElement('div')
  $inputsContainer.classList.add('inputs-container')
  const $addFormTitle = document.createElement('h3')
  $addFormTitle.classList.add('add-client__title', 'form-title')




  // Элементы инпута Фамилии
  const $groupSurname = document.createElement('div')
  $groupSurname.classList.add('input-group', 'surname-group')
  const $addFormSurname = document.createElement('input')
  $addFormSurname.setAttribute('data-required', 'true')
  $addFormSurname.setAttribute('data-check', 'check')
  $addFormSurname.classList.add('add-client__surname', 'add-client__input')
  $addFormSurname.setAttribute('placeholder', 'Фамилия')
  const $labelSurname = document.createElement('label')
  $labelSurname.classList.add('input-label', 'input-label-star')

  $labelSurname.textContent = "Фамилия"

  $groupSurname.append($addFormSurname, $labelSurname)

  // -----------------------------------------------Элементы модальных окон------------------------------------------------------
  const $groupName = document.createElement('div')
  $groupName.classList.add('input-group', 'name-group')
  const $addFormName = document.createElement('input')
  $addFormName.setAttribute('data-required', 'true')
  $addFormName.setAttribute('data-check', 'check')
  $addFormName.classList.add('add-client__name', 'add-client__input')
  $addFormName.setAttribute('placeholder', 'Имя')
  const $labelName = document.createElement('label')
  $labelName.classList.add('input-label', 'input-label-star')

  $labelName.textContent = "Имя"

  $groupName.append($addFormName, $labelName)

  // Элементы инпута Отчество
  const $groupLastname = document.createElement('div')
  $groupLastname.classList.add('input-group', 'lastname-group')
  const $addFormLastname = document.createElement('input')
  $addFormLastname.classList.add('add-client__lastname', 'add-client__input')
  $addFormLastname.setAttribute('data-check', 'check')
  $addFormLastname.setAttribute('placeholder', 'Отчество')
  const $labelLastname = document.createElement('label')
  $labelLastname.classList.add('input-label')
  $labelLastname.textContent = "Отчество"
  $groupLastname.append($addFormLastname, $labelLastname)

  const $contactsList = document.createElement('ul')
  $contactsList.classList.add('contacts-list', 'list-reset')


  const $addFormAddContact = document.createElement('button')
  $addFormAddContact.classList.add('add-client__add-contact', 'btn')
  $addFormAddContact.setAttribute('type', 'button')
  $addFormAddContact.textContent = 'Добавить контакт';
  const $addContactIcon = document.createElement('span')
  $addContactIcon.classList.add('add-contact-icon')
  $addContactIcon.innerHTML = `<svg viewBox="0 0 160 160" height="16" width="16" xmlns="http://www.w3.org/2000/svg" >
  <circle r="60" cx="80" cy="80" fill="transparent" stroke="#9873FF" stroke-width="13.5px"></circle>
  <g fill="#9873FF" >
    <rect width="13.5" height="66.5" x="73.3" y="46.6" rx="7"></rect>
    <rect width="13.5" height="66.5" x="73.3" y="46.6" rx="7" transform = "rotate(90 80 80)"></rect>
  </g>
</svg>`
  $addFormAddContact.prepend( $addContactIcon)
  const $addFormSave = document.createElement('button')
  $addFormSave.classList.add('add-client__save', 'btn')
  $addFormSave.textContent = 'Сохранить';
  $addFormSave.setAttribute('type', 'submit')
  const $addFormCancel = document.createElement('button')
  $addFormCancel.classList.add('add-client__cancel', 'btn')
  $addFormCancel.textContent = 'Отмена';
  const $addFormClose = document.createElement('button')
  $addFormClose.classList.add('add-client__close', 'btn')
  const $deleteModalTitle = document.createElement('h3')
  $deleteModalTitle.classList.add('delete-modal-title', 'form-title')
  $deleteModalTitle.textContent = 'Удалить клиента'
  const $deleteModalQuestion = document.createElement('h3')
  $deleteModalQuestion.classList.add('delete-modal-question')
  $deleteModalQuestion.textContent = 'Вы действительно хотите удалить данного клиента?'
  const $deleteClientButton = document.createElement('button')
  $deleteClientButton.classList.add('delete-client-btn', 'btn')
  $deleteClientButton.textContent = 'Удалить';
  $deleteClientButton.setAttribute('type', 'button')
  let $modalId = document.createElement('span')
  $modalId.classList.add('modal-id')

  const $editModalBtnDelete = document.createElement('button')
  $editModalBtnDelete.classList.add('edit-modal-delete', 'btn')
  $editModalBtnDelete.textContent = 'Удалить клиента';

  // Элементы ошибки
  const $currentErrors = document.createElement('div')
  $currentErrors.classList.add('current-errors-show')
  $addFormAddContact.after($currentErrors)


  // Добавляем эл-ты в форму
  document.body.append($clientForm);
  $inputsContainer.append($addFormTitle, $groupSurname, $groupName, $groupLastname);


  // Создаем форму удаления клиента
  const $deleteForm = document.createElement('delete-client__form', 'form')
  $deleteForm.classList.add('delete-client__title', 'form-title')
  $deleteForm.classList.add('delete-client__title')

  // ----------------------------------------------------Функции вызова и закрытия модальных окон-------------------------------------------------------------------
  // Будем вызывать разные окна спомощью функций, набором элементов
  // Открыть модальное для нового клиента
  function showAddModal() {
    $clientForm.append($inputsContainer, $contactsList, $addFormAddContact, $currentErrors, $addFormSave, $addFormCancel, $addFormClose)
    $addFormTitle.textContent = 'Новый клиент'
    modalFlag = true;
    removeFocus()
  }
  // Открыть модальное для редактирования
  function showEditModal() {
    $clientForm.append($inputsContainer, $contactsList, $addFormAddContact, $currentErrors, $addFormSave, $editModalBtnDelete, $addFormClose)
    $addFormTitle.textContent = 'Изменить данные'
    $addFormTitle.append($modalId)
    modalFlag = false;

  }

  function getIdToEdit(id) {
    $modalId.textContent = `ID:${id}`
  }

  // функция получения данных для редактирования
  function getContactsToEdit(contacts) {
    $contactsList.innerHTML = ''
    for (let obj of contacts) {
      let contact = createNewContact();
      contact.$newContactInput.value = obj.value;
      let contactTypeEdit = contact.$newContactType;
      let editTypeList = contactTypeEdit.querySelector('.contact-type-list')
      let selectedType;
      if (obj.type === 'Телефон') {
        selectedType = editTypeList.querySelector('.phone');
        editTypeList.prepend(selectedType)
      } else if (obj.type === 'доп.телефон') {
        selectedType = editTypeList.querySelector('.add-phone');
        editTypeList.prepend(selectedType)
      } else if (obj.type === 'Email') {
        selectedType = editTypeList.querySelector('.email');
        editTypeList.prepend(selectedType)
      } else if (obj.type === 'Vk') {
        selectedType = editTypeList.querySelector('.vk');
        editTypeList.prepend(selectedType)
      } else {
        selectedType = editTypeList.querySelector('.facebook');
        editTypeList.prepend(selectedType)
      }
    }
  }

  // Открывать модальное при удалении
  function showDeleteModal() {
    $clientForm.append($deleteModalTitle, $deleteModalQuestion, $deleteClientButton, $addFormCancel, $addFormClose)
  }
  // фунция при закрытии модального для очистки
  async function clearModal() {
    $clientForm.classList.remove('form-active')
    $modal.classList.remove('modal-active')
    $clientForm.innerHTML = ''
  }

  // Функция удаления общая для разных кнопок
  async function deleteClientGeneral(id) {
    await deleteClientstServer(id)
    let serverData = await getClientsListServer()

    clientsList = [...serverData]
    render(clientsList)
    clearModal()
  }

  //  Функция добавления новой строки с клиентом и ее обработка
  function addClientsTr(oneClient) {
    let $clientRow = document.createElement('tr')
    let $clientID = document.createElement('td')
    let $clientSNL = document.createElement('td')
    let $clientCreatedAt = document.createElement('td')
    let $createdAtForSort = document.createElement('span')
    let $createdAtDate = document.createElement('span')
    let $createdAtTime = document.createElement('span')
    let $clientUpdatedAt = document.createElement('td')
    let $updatedAtDate = document.createElement('span')
    let $updatedAtTime = document.createElement('span')
    let $clientContacts = document.createElement('td')
    let $clientActions = document.createElement('td')
    let $editBtn = document.createElement('button')
    let $deleteBtn = document.createElement('button')
    //  Классы
    $clientRow.classList.add('tbody__row', 'row')
    $clientID.classList.add('row__id', 'client-cell')
    $clientSNL.classList.add('row__snl', 'client-cell')
    $clientCreatedAt.classList.add('row__create', 'client-cell')
    $createdAtDate.classList.add('row__date')
    $createdAtTime.classList.add('row__time')
    $updatedAtDate.classList.add('row__date')
    $updatedAtTime.classList.add('row__time')
    $clientUpdatedAt.classList.add('row__change',  'client-cell')
    $clientContacts.classList.add('row__contacts')
    $clientActions.classList.add('row__actions')
    $editBtn.classList.add('edit-button', 'btn')
    $deleteBtn.classList.add('delete-button', 'btn')



    // Прослушка кнопки удалить из таблицы
    $deleteBtn.addEventListener('click', async function () {
      showDeleteModal()
      $clientForm.classList.add('form-active')
      $modal.classList.add('modal-active')
      //  В модальном при подтверждении удалить
      $deleteClientButton.addEventListener('click', async function (e) {
        e.preventDefault()
        deleteClientGeneral(oneClient.id)
      }, { once: true })

    })

    // ПРослушка кнопки редактирования клиента в таблице
    $editBtn.addEventListener('click', async function (e) {
      e.preventDefault()
      let clientServer = await getClientForEditServer(oneClient.id)
      editClientID = oneClient.id;
      getIdToEdit(clientServer.id);
      getContactsToEdit(clientServer.contacts)
      showEditModal()

      $addFormSurname.value = clientServer.surname;
      $addFormName.value = clientServer.name;
      $addFormLastname.value = clientServer.lastName;
      $clientForm.classList.add('form-active')
      $modal.classList.add('modal-active')
      // Обработчик удаления клиента в модальном окне редактирования
      $editModalBtnDelete.addEventListener('click', async function (e) {
        e.preventDefault()
        deleteClientGeneral(oneClient.id)
      }, { once: true })

    })

    let createdMS = Date.parse(oneClient.createdAt);
    let updatedMS = Date.parse(oneClient.createdAt);

    let createdMonthOrdered = new Date(createdMS).getMonth() + 1;
    if (createdMonthOrdered < 10) {
      createdMonthOrdered = '0' + createdMonthOrdered;
    }
    let createdHrs = new Date(createdMS).getHours();
    if (createdHrs < 10) {
      createdHrs = '0' + createdHrs;
    }
    let createdMins = new Date(createdMS).getMinutes();
    if (createdMins < 10) {
      createdMins = '0' + createdMins;
    }
    let updatedMonthOrdered = new Date(updatedMS).getMonth() + 1;
    if (updatedMonthOrdered < 10) {
      updatedMonthOrdered = '0' + updatedMonthOrdered;
    }
    let updatedHrs = new Date(updatedMS).getHours();
    if (updatedHrs < 10) {
      updatedHrs = '0' + updatedHrs;
    }
    let updatedMins = new Date(updatedMS).getMinutes();
    if (updatedMins < 10) {
      updatedMins = '0' + updatedMins;
    }

    $clientID.textContent = oneClient.id;
    $clientSNL.textContent = oneClient.snl;
    $createdAtDate.textContent = new Date(createdMS).getDate() + '.' + createdMonthOrdered + '.' + new Date(createdMS).getFullYear();
    $createdAtTime.textContent = createdHrs + ':' + createdMins;
    $clientCreatedAt.textContent = createdMS;
    $updatedAtDate.textContent = new Date(updatedMS).getDate() + '.' + updatedMonthOrdered + '.' + new Date(updatedMS).getFullYear();
    $updatedAtTime.textContent = updatedHrs + ':' + updatedMins;
    $editBtn.textContent = "Изменить"
    $deleteBtn.textContent = "Удалить"
    $clientRow.append($clientID, $clientSNL, $clientCreatedAt, $clientUpdatedAt, $clientContacts, $clientActions)
    $clientCreatedAt.append($createdAtDate, $createdAtTime)
    $clientUpdatedAt.append($updatedAtDate, $updatedAtTime)
    $clientActions.append($editBtn, $deleteBtn)
    // Вытаскиваем только контакты из массива
    let { contacts } = oneClient;
    // Список в который будут добавляться иконки контактов
    let $contactsUl = document.createElement('ul')
    $contactsUl.classList.add('contacts-list-ul', 'list-reset', 'flex')
    $clientContacts.append($contactsUl)

    // Добавление тултипов для контактов
    function hoverContact(obj) {
      let rect = document.createElement('div')
      rect.classList.add('hovered-contact')
      rect.textContent = obj.value;
      return rect;
    }
    // Проверяем каждый контакт для добавления в таблицу
    for (let oneCont of contacts) {
      let $contactLi = document.createElement('li')
      $contactLi.classList.add('contacts-item-li')
      let $contactLink = document.createElement('a')
      $contactLi.append($contactLink)
      $contactsUl.append($contactLi)
      let $hoveredContact;

      $contactLi.addEventListener('mouseenter', function () {
        $hoveredContact = hoverContact(oneCont)
        $contactLink.append($hoveredContact)
      })
      $contactLi.addEventListener('mouseleave', function () {
        $hoveredContact.remove()
      })

      switch (oneCont.type) {
        case 'Телефон':
          $contactLink.classList.add('contact-phone', 'contact-link')
          $contactLink.setAttribute('href', `tel: ${oneCont.value}`)
          $contactLink.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><g ><circle cx="8" cy="8" r="8" fill="#9873FF"/><path d="M11.56 9.50222C11.0133 9.50222 10.4844 9.41333 9.99111 9.25333C9.83556 9.2 9.66222 9.24 9.54222 9.36L8.84444 10.2356C7.58667 9.63556 6.40889 8.50222 5.78222 7.2L6.64889 6.46222C6.76889 6.33778 6.80444 6.16444 6.75556 6.00889C6.59111 5.51556 6.50667 4.98667 6.50667 4.44C6.50667 4.2 6.30667 4 6.06667 4H4.52889C4.28889 4 4 4.10667 4 4.44C4 8.56889 7.43556 12 11.56 12C11.8756 12 12 11.72 12 11.4756V9.94222C12 9.70222 11.8 9.50222 11.56 9.50222Z" fill="white"/></g></svg>`
          break;
        case 'доп.телефон':
          $contactLink.classList.add('contact-add-phone', 'contact-link')
          $contactLink.setAttribute('href', `tel: ${oneCont.value}`)
          $contactLink.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path  fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM3 8C3 5.24 5.24 3 8 3C10.76 3 13 5.24 13 8C13 10.76 10.76 13 8 13C5.24 13 3 10.76 3 8ZM9.5 6C9.5 5.17 8.83 4.5 8 4.5C7.17 4.5 6.5 5.17 6.5 6C6.5 6.83 7.17 7.5 8 7.5C8.83 7.5 9.5 6.83 9.5 6ZM5 9.99C5.645 10.96 6.75 11.6 8 11.6C9.25 11.6 10.355 10.96 11 9.99C10.985 8.995 8.995 8.45 8 8.45C7 8.45 5.015 8.995 5 9.99Z" fill="#9873FF"/></svg>`
          break;
        case 'Email':
          $contactLink.classList.add('contact-email', 'contact-link')
          $contactLink.setAttribute('href', `mailto: ${oneCont.value}`)
          $contactLink.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path opacity="0.7" fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM4 5.75C4 5.3375 4.36 5 4.8 5H11.2C11.64 5 12 5.3375 12 5.75V10.25C12 10.6625 11.64 11 11.2 11H4.8C4.36 11 4 10.6625 4 10.25V5.75ZM8.424 8.1275L11.04 6.59375C11.14 6.53375 11.2 6.4325 11.2 6.32375C11.2 6.0725 10.908 5.9225 10.68 6.05375L8 7.625L5.32 6.05375C5.092 5.9225 4.8 6.0725 4.8 6.32375C4.8 6.4325 4.86 6.53375 4.96 6.59375L7.576 8.1275C7.836 8.28125 8.164 8.28125 8.424 8.1275Z" fill="#9873FF"/></svg>`
          break;
        case 'Vk':
          $contactLink.classList.add('contact-vk', 'contact-link')
          $contactLink.setAttribute('href', `${oneCont.value}`)
          $contactLink.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><g ><path d="M8 0C3.58187 0 0 3.58171 0 8C0 12.4183 3.58187 16 8 16C12.4181 16 16 12.4183 16 8C16 3.58171 12.4181 0 8 0ZM12.058 8.86523C12.4309 9.22942 12.8254 9.57217 13.1601 9.97402C13.3084 10.1518 13.4482 10.3356 13.5546 10.5423C13.7065 10.8371 13.5693 11.1604 13.3055 11.1779L11.6665 11.1776C11.2432 11.2126 10.9064 11.0419 10.6224 10.7525C10.3957 10.5219 10.1853 10.2755 9.96698 10.037C9.87777 9.93915 9.78382 9.847 9.67186 9.77449C9.44843 9.62914 9.2543 9.67366 9.1263 9.90707C8.99585 10.1446 8.96606 10.4078 8.95362 10.6721C8.93577 11.0586 8.81923 11.1596 8.43147 11.1777C7.60291 11.2165 6.81674 11.0908 6.08606 10.6731C5.44147 10.3047 4.94257 9.78463 4.50783 9.19587C3.66126 8.04812 3.01291 6.78842 2.43036 5.49254C2.29925 5.2007 2.39517 5.04454 2.71714 5.03849C3.25205 5.02817 3.78697 5.02948 4.32188 5.03799C4.53958 5.04143 4.68362 5.166 4.76726 5.37142C5.05633 6.08262 5.4107 6.75928 5.85477 7.38684C5.97311 7.55396 6.09391 7.72059 6.26594 7.83861C6.45582 7.9689 6.60051 7.92585 6.69005 7.71388C6.74734 7.57917 6.77205 7.43513 6.78449 7.29076C6.82705 6.79628 6.83212 6.30195 6.75847 5.80943C6.71263 5.50122 6.53929 5.30218 6.23206 5.24391C6.07558 5.21428 6.0985 5.15634 6.17461 5.06697C6.3067 4.91245 6.43045 4.81686 6.67777 4.81686L8.52951 4.81653C8.82136 4.87382 8.88683 5.00477 8.92645 5.29874L8.92808 7.35656C8.92464 7.47032 8.98521 7.80751 9.18948 7.88198C9.35317 7.936 9.4612 7.80473 9.55908 7.70112C10.0032 7.22987 10.3195 6.67368 10.6029 6.09801C10.7279 5.84413 10.8358 5.58142 10.9406 5.31822C11.0185 5.1236 11.1396 5.02785 11.3593 5.03112L13.1424 5.03325C13.195 5.03325 13.2483 5.03374 13.3004 5.04274C13.6009 5.09414 13.6832 5.22345 13.5903 5.5166C13.4439 5.97721 13.1596 6.36088 12.8817 6.74553C12.5838 7.15736 12.2661 7.55478 11.9711 7.96841C11.7001 8.34652 11.7215 8.53688 12.058 8.86523Z" fill="#9873FF"/></g></svg>`
          break;
        case 'Facebook':
          $contactLink.classList.add('contact-facebook', 'contact-link')
          $contactLink.setAttribute('href', `${oneCont.value}`)

          $contactLink.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><g ><path d="M7.99999 0C3.6 0 0 3.60643 0 8.04819C0 12.0643 2.928 15.3976 6.75199 16V10.3775H4.71999V8.04819H6.75199V6.27309C6.75199 4.25703 7.94399 3.14859 9.77599 3.14859C10.648 3.14859 11.56 3.30121 11.56 3.30121V5.28514H10.552C9.55999 5.28514 9.24799 5.90362 9.24799 6.53815V8.04819H11.472L11.112 10.3775H9.24799V16C11.1331 15.7011 12.8497 14.7354 14.0879 13.2772C15.3261 11.819 16.0043 9.96437 16 8.04819C16 3.60643 12.4 0 7.99999 0Z" fill="#9873FF"/></g></svg>`

          break;
      }
    }
    return $clientRow
  }

  // Функция обработки массива клиента
  async function render(arrData) {
    $tBody.innerHTML = '';
    let copyClientsList = [...arrData]

    // Подготовка
    for (const client of copyClientsList) {
      client.snl = client.name.trim().charAt(0).toUpperCase() + client.name.trim().slice(1).toLowerCase() + ' '
        + client.lastName.trim().charAt(0).toUpperCase() + client.lastName.trim().slice(1).toLowerCase() + ' '
        + client.surname.trim().charAt(0).toUpperCase() + client.surname.trim().slice(1).toLowerCase()
    }


    // Сортировка
    copyClientsList = copyClientsList.sort(function (a, b) {
      // let $arrow = document.getElementById('sort-arrow-' + `${sortColumnFlag}`)
      // parentEl.classList.add('parent-sort-active')


      // sortDirFlag == true ? $arrow.classList.add('sort-arrow-active') : $arrow.classList.remove('sort-arrow-active')
      let sort = a[sortColumnFlag] < b[sortColumnFlag]
      if (sortDirFlag == false) sort = a[sortColumnFlag] > b[sortColumnFlag];
      return sort ? -1 : 1
    })

    // Отрисовка
    for (const oneClient of copyClientsList) {
      const $newTr = addClientsTr(oneClient)
      $tBody.append($newTr)

      // Добавляем иконку +6 контактов
      const contList = $newTr.querySelector('.contacts-list-ul')
      $newTr.querySelector('.contacts-list-ul');
      const $contactsContainer = $newTr.querySelector('.contacts-list-ul');
      for (let i = 4; i < contList.children.length; i++) {
        contList.children[i].classList.add('disapered')
      }
      if (contList.children.length > 3) {
        const $moreLinksIcon = document.createElement('span')
        $moreLinksIcon.classList.add('more-links-icon')
        $moreLinksIcon.textContent = '+6'
        $moreLinksIcon.addEventListener('mouseenter', function (e) {
          e.preventDefault()
          for (let i = 4; i < contList.children.length; i++) {
            contList.children[i].classList.remove('disapered')
          }
          $moreLinksIcon.classList.add('disapered')
        })
        $contactsContainer.addEventListener('mouseleave', function () {
          for (let i = 4; i < contList.children.length; i++) {
            contList.children[i].classList.add('disapered')
          }
          $moreLinksIcon.classList.remove('disapered')
        })
        $contactsContainer.append($moreLinksIcon)
      }

    }
  }

  // Общая функция для закрытия и отмены модальных окон
  function formCloseCancel() {
    $clientForm.classList.remove('form-active')
    $modal.classList.remove('modal-active')
    $contactsList.innerHTML = '';
    $clientForm.reset()
    $clientForm.innerHTML = ''
    $addFormAddContact.classList.remove('disapered')
    $currentErrors.innerHTML = ''
    restoreFocus()
  }

  // Прослушка кнопок закрыть и отмена
  //  Закрыть
  $addFormClose.addEventListener('click', function (e) {
    e.preventDefault();
    formCloseCancel();
  })

  // Прослушка кнопки отмена в модальном окне
  $addFormCancel.addEventListener('click', function (e) {
    e.preventDefault();
    formCloseCancel();
  })

  // Открыть Модальное окно добавить клиента
  const $addClientBtn = document.getElementById('add-client')

  // Функция получения данных с сервера
  async function getClientsListServer() {
    let response = await fetch(SERVER_URL + '/api/clients', {
      method: 'GET',
      headers: { 'Content-type': 'application/json' },
    })
    let data = await response.json()

    return data
  }

  // Функция отправки отредактированного контакта на сервер
  async function editClientsServer(id, obj) {
    let response = await fetch(SERVER_URL + '/api/clients/' + id, {
      method: 'PATCH',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(obj)
    })
    let data = await response.json();
    return {
      response,
      data
    }
  }
  //  Функция запроса на редактирование клиента
  async function getClientForEditServer(id) {
    let response = await fetch(SERVER_URL + `/api/clients/` + id, {
      method: 'GET',
      headers: { 'Content-type': 'application/json' },
    })
    let data = await response.json();
    return data;
  }

  // ----------------Прослушка кнопки добавления нового клиента -------------------
  $addClientBtn.addEventListener('click', function (e) {
    e.preventDefault()
    showAddModal()
    $clientForm.classList.add('form-active')
    $modal.classList.add('modal-active')
    $contactsList.innerHTML = ''
  })

  // Прослушка формы добавления, редактирования общая, спомощью флага
  $clientForm.addEventListener('submit', async function (e) {
    e.preventDefault()
    $currentErrors.innerHTML = ''
    if (validationForm(this) == false) {
      return
    }

    // Добавляем контакты и соцсети одному контакту
    function addContactsToNewClient() {
      let totalAllContacts = [];
      for (let i = 0; i < $contactsList.children.length; i++) {
        let inputContact = $contactsList.querySelectorAll('.add-contact-input')
        let contact = {
          type: $contactsList.children[i].children[0].children[0].children[0].textContent,
          value: Array.from(inputContact)[i].value
        }
        totalAllContacts.push(contact)
      }
      return totalAllContacts;
    }


    // создаем объект клиента для отправки на сервер
    let newClient = {
      surname: $addFormSurname.value,
      name: $addFormName.value,
      lastName: $addFormLastname.value,
      contacts: addContactsToNewClient()
    }
    // В зависимости от флага меняем функционал кнопки СОХРАНИТЬ
    if (modalFlag) {
      try {
        let response = await fetch(SERVER_URL + '/api/clients', {
          method: 'POST',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify(newClient)
        })
        let clientFmServer = await response.json();
        if (response.ok) {
          clientsList.push(clientFmServer)
          $clientForm.reset()
          $contactsList.innerHTML = ''
          contactsList.length = 0
          $currentErrors.innerHTML = ''

        }
        if (response.status === 422) {
          $currentErrors.innerHTML = ''
          clientFmServer.errors.forEach(error => {
            const $error = document.createElement('p')
            $error.classList.add('error-server')
            $error.textContent = error.message
            $currentErrors.append($error)
          });
        }
      } catch (err) {
        const $error = document.createElement('p')
        $error.textContent = "Что-то пошло не так!"
        $error.classList.add('error-server')
        $currentErrors.append($error)
      }
    } else {
      let response = (await editClientsServer(editClientID, newClient));

      if (response.response.ok) {
        clearModal()
      }
      if (response.response.status === 422) {
        $currentErrors.innerHTML = ''
        response.data.errors.forEach(error => {
          const $error = document.createElement('p')
          $error.classList.add('error-server')
          $error.textContent = error.message
          $currentErrors.append($error)
        });
      }
    }

    clientsList = await getClientsListServer()
    render(clientsList)
    $addFormAddContact.classList.remove('disapered')
  })

  // Прослушка кнопки добавить новый контакт
  $addFormAddContact.addEventListener('click', function (e) {
    e.preventDefault()
    let $newContactObj = createNewContact();
    contactsList.push($newContactObj);
  })

  // Функция создания новго контакта
  function createNewContact() {
    const $newContact = document.createElement('li')
    $newContact.classList.add('new-contact')
    const $newContactType = createContactTypeList()
    const $newContactInput = document.createElement('input')
    $newContactInput.classList.add('add-contact-input')
    $newContactInput.setAttribute('placeholder', 'Введите данные контакта')
    $newContactInput.classList.add('input-contact')
    const $newContactCancel = document.createElement('button')
    $newContactCancel.classList.add('contact-cancel', 'btn')
    $newContactCancel.setAttribute('type', 'button')
    $newContactCancel.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><g clip-path="url(#clip0_121_2521)">
  <path d="M8 2C4.682 2 2 4.682 2 8C2 11.318 4.682 14 8 14C11.318 14 14 11.318 14 8C14 4.682 11.318 2 8 2ZM8 12.8C5.354 12.8 3.2 10.646 3.2 8C3.2 5.354 5.354 3.2 8 3.2C10.646 3.2 12.8 5.354 12.8 8C12.8 10.646 10.646 12.8 8 12.8ZM10.154 5L8 7.154L5.846 5L5 5.846L7.154 8L5 10.154L5.846 11L8 8.846L10.154 11L11 10.154L8.846 8L11 5.846L10.154 5Z" fill="#B0B0B0"/></g>
  <defs><clipPath id="clip0_121_2521"><rect width="16" height="16" fill="white"/></clipPath></defs></svg>`

    $newContactCancel.addEventListener('click', function () {
      $newContact.remove()
      $addFormAddContact.classList.remove('disapered')
    })

    $newContact.append($newContactType, $newContactInput, $newContactCancel)

    // Если больше 9 контактов, кновку прячем
    if ($contactsList.children.length < 9) {
      $contactsList.append($newContact)
      // ПРи добавлении контактов модальное двигаем
      if ($contactsList.children.length >= 5) {
        console.log(document.querySelector('.act-form'));
        document.querySelector('.act-form').style.top = '70%';
      } else {
        document.querySelector('.act-form').style.top = '50%';
      }
    } else {
      $addFormAddContact.classList.add('disapered')
    }

    $contactsList.append($newContact)

    console.log(document.querySelector('.modal'));
    return {
      $newContact,
      $newContactInput,
      $newContactType,
    }
  }
  // Создаем свой select
  function createContactTypeList() {
    let $contactTypesCont = document.createElement('div')
    $contactTypesCont.classList.add('contact-types__container')
    let $contactTypesList = document.createElement('ul')
    $contactTypesList.classList.add('contact-type-list', 'list-reset')
    let $contactTypePhone = document.createElement('li')
    $contactTypePhone.classList.add('contact-type', 'phone')
    $contactTypePhone.textContent = 'Телефон'
    let $contactTypeAddPhone = document.createElement('li')
    $contactTypeAddPhone.classList.add('contact-type', 'add-phone')
    $contactTypeAddPhone.textContent = 'доп.телефон'
    let $contactTypeEmail = document.createElement('li')
    $contactTypeEmail.classList.add('contact-type', 'email')
    $contactTypeEmail.textContent = 'Email'
    let $contactTypeVk = document.createElement('li')
    $contactTypeVk.classList.add('contact-type', 'vk')
    $contactTypeVk.textContent = 'Vk'
    let $contactTypeFacebook = document.createElement('li')
    $contactTypeFacebook.classList.add('contact-type', 'facebook')
    $contactTypeFacebook.textContent = 'Facebook'
    $contactTypesCont.append($contactTypesList);
    $contactTypesList.append($contactTypePhone, $contactTypeAddPhone, $contactTypeEmail, $contactTypeVk, $contactTypeFacebook)
    // Открытие select
    $contactTypesList.addEventListener('click', function (e) {
      $contactTypesCont.classList.toggle('types-list-open');
      $contactTypesList.classList.toggle('types-list-active');
      $contactTypesList.addEventListener('mouseleave', function (e) {
        $contactTypesCont.classList.remove('types-list-open');
        $contactTypesList.classList.remove('types-list-active');
      })

      if ($contactTypesCont.classList.contains('types-list-open')) {
        for (let i = 0; i < $contactTypesList.children.length; i++) {
          $contactTypesList.children[i].addEventListener('click', function (e) {
            e.preventDefault()
            $contactTypesList.children[0].before($contactTypesList.children[i])

          }, { capture: true })

        }
      }

    })

    return $contactTypesCont
  }
  render(clientsList)

  // Функция валидации
  function validationForm(form) {
    let result;
    result = true;
    const allFormInputs = form.querySelectorAll('input');
    for (let input of allFormInputs) {
      removeError(input)
      if (input.dataset.check == 'check' && input.value !== '') {
        if (!/^[а-яА-ЯёЁ]+$/.test(input.value)) {
          removeError(input)
          showError(input, 'Допустимы только русские буквы')
          result = false;
        }
      }
      let contactInputs = Array.from($contactsList.querySelectorAll('input'))
      for (let input of contactInputs) {
        removeError(input)
        function onlyNumbers() {
          if (/[^0-9]+$/g.test(input.value) && input.value !== '') {
            removeError(input)
            showError(input, 'Допустимы только цифры')
            result = false;
          } else if (input.value.length !== 11 && input.value !== '') {
            removeError(input)
            showError(input, 'Допустимы только цифры 891812345678')
            result = false;

          }
        }
        function onlyEngLetters() {
          if (!/(^https?:\/\/)?[a-z0-9~_\-\.]+\.[a-z]{2,9}(\/|:|\?[!-~]*)?$/.test(input.value) && input.value !== '') {
            removeError(input)
            showError(input, 'Корректное доменное имя "facebook.com"')
            result = false;
          }
        }
        //


        if (input.previousSibling.children[0].children[0].textContent == 'Телефон') {
          onlyNumbers()
        } else if (input.previousSibling.children[0].children[0].textContent == 'Email') {
          if (!/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(input.value) && input.value !== '') {
            removeError(input)
            showError(input, 'Буквы и символы в формате - "abc@abc.ru"')
            result = false;
          }
        }
        else if (input.previousSibling.children[0].children[0].textContent == 'доп.телефон') {
          onlyNumbers()
        } else if (input.previousSibling.children[0].children[0].textContent == 'Vk' || input.previousSibling.children[0].children[0].textContent == 'Facebook') {
          onlyEngLetters()

        }
        // else if (input.previousSibling.children[0].children[0].textContent == 'Facebook') {
        //   onlyEngLetters()
        // }
        // Прослушка кнопок закрыть и отмена
        //  Закрыть

      }
      $addFormClose.addEventListener('click', function (e) {
        e.preventDefault();
        removeError(input)
      })

      // ПРослушка кнопки отмена в модальном окне
      $addFormCancel.addEventListener('click', function (e) {
        e.preventDefault();
        removeError(input)
      })
    }
    return result;
  }

  // Добавление ошибки клиентской валидации
  function showError(input, text) {
    const parentEl = input.parentNode;
    parentEl.classList.add('error')
    const errorLabel = document.createElement('span')
    errorLabel.classList.add('error-label')
    errorLabel.textContent = text;
    parentEl.append(errorLabel)
  }
  // Удаление ошибки клие валидации
  function removeError(input) {
    const parentEl = input.parentNode;
    if (parentEl.classList.contains('error')) {
      parentEl.querySelector('.error-label').remove()
      parentEl.classList.remove('error')
    }
  }

  // Функция создания ошибки с сервера
  function showErrorServer() {

  }

  // Клики сортировки
  $theadID.addEventListener('click', function () {
    sortColumnFlag = 'id'
    sortDirFlag = !sortDirFlag

    render(clientsList)
  })
  $theadSNL.addEventListener('click', function () {
    sortColumnFlag = 'snl'
    sortDirFlag = !sortDirFlag
    render(clientsList)
  })
  $theadCreatedAt.addEventListener('click', function () {
    sortColumnFlag = 'createdAt'
    sortDirFlag = !sortDirFlag
    render(clientsList)
  })
  $theadChangeAt.addEventListener('click', function () {
    sortColumnFlag = 'updatedAt'
    sortDirFlag = !sortDirFlag
    render(clientsList)
  })


  // Сортировка стрелки
  let selectedCell;
  $tHead.addEventListener('click', function (e) {
    if(selectedCell) {
      selectedCell.classList.remove('sort-target-active')

    }
    selectedCell = e.target;
    selectedCell.classList.add('sort-target-active')
    const nextRow = document.querySelector('.tbody__row')
    selectedCell.children[0].classList.remove('sort-arrow-active');
    if (sortDirFlag) {
        selectedCell.children[0].classList.add('sort-arrow-active');

      } else {
        selectedCell.children[0].classList.remove('sort-arrow-active');

      }

  })

  // При открытом модальном окне отменяем фокус за ним
  function removeFocus() {
    Array.from(document.getElementsByClassName('delete-button')).forEach((item) => { item.setAttribute('tabindex', '-1') });
    Array.from(document.getElementsByClassName('edit-button')).forEach((item) => { item.setAttribute('tabindex', '-1') });
    Array.from(document.getElementsByClassName('contact-link')).forEach((item) => { item.setAttribute('tabindex', '-1') });
    $addClientBtn.setAttribute('tabindex', '-1')
    $filterInput.setAttribute('tabindex', '-1')
  }
  // Возврашаем обратно
  function restoreFocus() {
    Array.from(document.getElementsByClassName('delete-button')).forEach((item) => { item.removeAttribute('tabindex') });
    Array.from(document.getElementsByClassName('edit-button')).forEach((item) => { item.removeAttribute('tabindex') });
    Array.from(document.getElementsByClassName('contact-link')).forEach((item) => { item.removeAttribute('tabindex') });
    $addClientBtn.removeAttribute('tabindex')
    $filterInput.removeAttribute('tabindex')
  }

})()

