import { marked } from 'marked';

// Configuración de marked para enlaces seguros
marked.setOptions({
  gfm: true,
  breaks: true,
});

// Iconos SVG en línea ligeros y consistentes con Lucide
const ICONS = {
  pencil: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>`,
  check: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  eye: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
  eyeOff: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>`,
  x: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  plus: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
};

function notifyStatus(state: 'saving' | 'saved' | 'error', message?: string) {
  window.dispatchEvent(new CustomEvent('page-editor-status', { detail: { state, message } }));
}

function renderMarkdownText(text: string, isMultiline: boolean): string {
  if (isMultiline) {
    return marked.parse(text) as string;
  }
  return marked.parseInline(text) as string;
}

export function initInlineEditor() {
  const bar = document.getElementById('page-editor-bar');
  if (!bar) return;

  const defaultPageId = bar.dataset.pageId || '';

  // 1. Inicializar bloques editables simples
  document.querySelectorAll<HTMLElement>('[data-editable-key]').forEach((el) => {
    attachBlockToolbar(el, defaultPageId);
  });

  // 2. Inicializar listas de elementos editables
  document.querySelectorAll<HTMLElement>('[data-editable-list]').forEach((listEl) => {
    attachListControls(listEl, defaultPageId);
  });
}

function attachBlockToolbar(el: HTMLElement, defaultPageId: string) {
  if (el.dataset.editorInitialized === 'true') return;
  el.dataset.editorInitialized = 'true';

  const pageId = el.dataset.editablePage || defaultPageId;
  const blockKey = el.dataset.editableKey;
  if (!blockKey) return;

  const isMultiline = el.dataset.editableMultiline === 'true' || el.tagName === 'DIV' || el.tagName === 'P';

  // Si no tiene raw text inicial, guardarlo del HTML/texto actual
  if (el.dataset.editableRaw === undefined) {
    el.dataset.editableRaw = el.textContent?.trim() || '';
  }

  // Asegurar que el elemento tenga posición relativa para anclar la barra
  if (window.getComputedStyle(el).position === 'static') {
    el.classList.add('relative');
  }

  // Crear la barra de acciones flotante
  const toolbar = document.createElement('div');
  toolbar.className = 'inline-editor-toolbar absolute -top-3 right-2 z-40 hidden items-center gap-1 bg-white/95 backdrop-blur-xs border border-black/15 shadow-md rounded-full px-1.5 py-0.5 select-none transition-all';
  toolbar.setAttribute('data-no-edit', 'true');

  // Botón Editar (Lápiz)
  const editBtn = document.createElement('button');
  editBtn.type = 'button';
  editBtn.className = 'btn-inline-edit w-6 h-6 rounded-full hover:bg-neutral-100 flex items-center justify-center text-[#af0b56] transition-transform hover:scale-110';
  editBtn.title = 'Editar texto';
  editBtn.innerHTML = ICONS.pencil;

  // Botón Ocultar / Mostrar (Ojo)
  const isHidden = el.getAttribute('data-editable-hidden') === 'true';
  const eyeBtn = document.createElement('button');
  eyeBtn.type = 'button';
  eyeBtn.className = 'btn-inline-toggle-eye w-6 h-6 rounded-full hover:bg-neutral-100 flex items-center justify-center text-gray-500 transition-transform hover:scale-110';
  eyeBtn.title = isHidden ? 'Mostrar este bloque' : 'Ocultar este bloque';
  eyeBtn.innerHTML = isHidden ? ICONS.eyeOff : ICONS.eye;

  toolbar.appendChild(editBtn);
  toolbar.appendChild(eyeBtn);
  el.appendChild(toolbar);

  // Manejador del botón Lápiz
  let isEditing = false;
  let activeEditorContainer: HTMLElement | null = null;
  let contentBackupEl: HTMLElement | null = null;

  editBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isEditing) return;
    openBlockEditor();
  });

  function openBlockEditor() {
    isEditing = true;
    toolbar.classList.add('hidden');

    const currentRaw = el.dataset.editableRaw || el.textContent?.trim() || '';

    // Contenedor del editor
    const editContainer = document.createElement('div');
    editContainer.className = 'inline-editor-box w-full my-2 space-y-2 p-3 bg-white/95 rounded-2xl border-2 border-[#af0b56] shadow-xl z-30 font-sans';
    activeEditorContainer = editContainer;

    // Campo de entrada
    let inputEl: HTMLInputElement | HTMLTextAreaElement;
    if (isMultiline) {
      inputEl = document.createElement('textarea');
      inputEl.className = 'textarea w-full text-base font-normal leading-relaxed text-[#1d1d1b] bg-white border border-black/15 rounded-xl p-3 focus:outline-none focus:border-[#af0b56] focus:ring-1 focus:ring-[#af0b56] min-h-[140px] resize-y';
      inputEl.value = currentRaw;
    } else {
      inputEl = document.createElement('input');
      inputEl.type = 'text';
      inputEl.className = 'input w-full text-base font-medium text-[#1d1d1b] bg-white border border-black/15 rounded-xl px-3 py-2 focus:outline-none focus:border-[#af0b56] focus:ring-1 focus:ring-[#af0b56]';
      inputEl.value = currentRaw;
    }

    // Botones de acción (Guardar / Cancelar)
    const actionRow = document.createElement('div');
    actionRow.className = 'flex items-center justify-between gap-2 pt-1 border-t border-black/10';

    const tip = document.createElement('span');
    tip.className = 'text-[10px] text-gray-500 font-mono';
    tip.textContent = 'Admite **negrita**, *cursiva*, [enlace](url). (Ctrl+Enter para guardar)';

    const btnGroup = document.createElement('div');
    btnGroup.className = 'flex items-center gap-1.5';

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'btn btn-xs btn-ghost text-gray-600 rounded-lg inline-flex items-center gap-1';
    cancelBtn.innerHTML = `${ICONS.x} Cancelar`;

    const saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'btn btn-xs bg-[#af0b56] hover:bg-[#8f0946] text-white rounded-lg inline-flex items-center gap-1 font-bold shadow-xs';
    saveBtn.innerHTML = `${ICONS.check} Guardar`;

    btnGroup.appendChild(cancelBtn);
    btnGroup.appendChild(saveBtn);
    actionRow.appendChild(tip);
    actionRow.appendChild(btnGroup);

    editContainer.appendChild(inputEl);
    editContainer.appendChild(actionRow);

    // Ocultar contenido visual previo y agregar el editor
    const contentTarget = el.querySelector<HTMLElement>('[data-editable-content]') || el;
    const originalChildren = Array.from(contentTarget.childNodes).filter((n) => n !== toolbar);
    const hiddenWrap = document.createElement('div');
    hiddenWrap.className = 'hidden';
    originalChildren.forEach((child) => hiddenWrap.appendChild(child));
    contentBackupEl = hiddenWrap;
    contentTarget.appendChild(hiddenWrap);
    contentTarget.appendChild(editContainer);

    inputEl.focus();

    // Guardado
    async function handleSave() {
      const newText = inputEl.value.trim();
      notifyStatus('saving', 'Publicando cambio...');
      saveBtn.disabled = true;

      try {
        const res = await fetch('/api/admin/page-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'save-block',
            pageId,
            blockKey,
            text: newText,
          }),
        });

        const result = await res.json();
        if (!res.ok || !result.success) {
          throw new Error(result.error || 'Error al guardar el contenido');
        }

        // Actualizar datos en memoria y renderizar nuevo HTML
        el.dataset.editableRaw = newText;
        const renderedHtml = renderMarkdownText(newText, isMultiline);

        // Restaurar vista con el contenido actualizado
        editContainer.remove();
        hiddenWrap.remove();
        contentTarget.innerHTML = renderedHtml;
        contentTarget.appendChild(toolbar);

        notifyStatus('saved', 'Cambio publicado inmediatamente');
        isEditing = false;
        toolbar.classList.remove('hidden');
      } catch (err: any) {
        console.error('Error guardando bloque inline:', err);
        notifyStatus('error', err.message || 'Error al guardar');
        saveBtn.disabled = false;
      }
    }

    function handleCancel() {
      editContainer.remove();
      // Restaurar nodos originales
      while (hiddenWrap.firstChild) {
        contentTarget.appendChild(hiddenWrap.firstChild);
      }
      hiddenWrap.remove();
      contentTarget.appendChild(toolbar);
      isEditing = false;
      toolbar.classList.remove('hidden');
    }

    saveBtn.addEventListener('click', handleSave);
    cancelBtn.addEventListener('click', handleCancel);

    inputEl.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' && (ev.ctrlKey || ev.metaKey)) {
        ev.preventDefault();
        handleSave();
      } else if (ev.key === 'Escape') {
        ev.preventDefault();
        handleCancel();
      }
    });
  }

  // Manejador del botón Ojo (Visibilidad)
  eyeBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    notifyStatus('saving', 'Actualizando visibilidad...');
    eyeBtn.disabled = true;

    try {
      const defaultText = el.dataset.editableRaw || el.textContent?.trim() || '';
      const res = await fetch('/api/admin/page-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle-block-visibility',
          pageId,
          blockKey,
          defaultText,
        }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Error al cambiar visibilidad');
      }

      const nowHidden = result.block?.hidden ?? false;
      el.setAttribute('data-editable-hidden', nowHidden ? 'true' : 'false');
      eyeBtn.innerHTML = nowHidden ? ICONS.eyeOff : ICONS.eye;
      eyeBtn.title = nowHidden ? 'Mostrar este bloque' : 'Ocultar este bloque';

      notifyStatus('saved', nowHidden ? 'Bloque ocultado' : 'Bloque visible');
    } catch (err: any) {
      console.error('Error alternando visibilidad:', err);
      notifyStatus('error', err.message || 'Error al cambiar visibilidad');
    } finally {
      eyeBtn.disabled = false;
    }
  });
}

function attachListControls(listEl: HTMLElement, defaultPageId: string) {
  if (listEl.dataset.listControlsInitialized === 'true') return;
  listEl.dataset.listControlsInitialized = 'true';

  const pageId = listEl.dataset.editablePage || defaultPageId;
  const listKey = listEl.dataset.editableList;
  if (!listKey) return;

  // 1. Añadir barra de edición a cada item existente
  const items = listEl.querySelectorAll<HTMLElement>('[data-editable-item-id]');
  items.forEach((itemEl) => {
    attachListItemToolbar(itemEl, pageId, listKey, listEl);
  });

  // 2. Inyectar botón "+ Añadir nuevo elemento" al final de la lista
  const addBtnContainer = document.createElement('div');
  addBtnContainer.className = 'inline-editor-add-item-wrap my-4 hidden select-none';
  addBtnContainer.setAttribute('data-no-edit', 'true');

  const addBtn = document.createElement('button');
  addBtn.type = 'button';
  addBtn.className = 'btn btn-sm border-2 border-dashed border-[#af0b56]/40 hover:border-[#af0b56] text-[#af0b56] hover:bg-[#af0b56]/5 rounded-2xl w-full py-2.5 font-bold text-xs inline-flex items-center justify-center gap-1.5 transition-all shadow-xs hover:shadow-sm';
  addBtn.innerHTML = `${ICONS.plus} Añadir nuevo punto a la lista`;

  addBtnContainer.appendChild(addBtn);

  // Colocar el botón después de la lista en el DOM
  listEl.parentNode?.insertBefore(addBtnContainer, listEl.nextSibling);

  // Manejador del botón "+ Añadir"
  addBtn.addEventListener('click', () => {
    openAddItemForm(addBtnContainer, listEl, pageId, listKey);
  });
}

function attachListItemToolbar(itemEl: HTMLElement, pageId: string, listKey: string, listEl: HTMLElement) {
  if (itemEl.dataset.itemToolbarInitialized === 'true') return;
  itemEl.dataset.itemToolbarInitialized = 'true';

  const itemId = itemEl.dataset.editableItemId;
  if (!itemId) return;

  if (window.getComputedStyle(itemEl).position === 'static') {
    itemEl.classList.add('relative');
  }

  const isHidden = itemEl.getAttribute('data-editable-hidden') === 'true';

  // Buscar el contenedor específico de texto si existe, o el elemento completo
  const textTarget = itemEl.querySelector<HTMLElement>('[data-editable-item-text]') || itemEl;
  if (itemEl.dataset.editableRaw === undefined) {
    itemEl.dataset.editableRaw = textTarget.textContent?.trim() || '';
  }

  // Barra flotante del item
  const toolbar = document.createElement('div');
  toolbar.className = 'inline-editor-toolbar absolute -top-3 right-2 z-40 hidden items-center gap-1 bg-white/95 backdrop-blur-xs border border-black/15 shadow-md rounded-full px-1.5 py-0.5 select-none transition-all';
  toolbar.setAttribute('data-no-edit', 'true');

  const editBtn = document.createElement('button');
  editBtn.type = 'button';
  editBtn.className = 'btn-inline-edit w-6 h-6 rounded-full hover:bg-neutral-100 flex items-center justify-center text-[#af0b56] transition-transform hover:scale-110';
  editBtn.title = 'Editar texto del punto';
  editBtn.innerHTML = ICONS.pencil;

  const eyeBtn = document.createElement('button');
  eyeBtn.type = 'button';
  eyeBtn.className = 'btn-inline-toggle-eye w-6 h-6 rounded-full hover:bg-neutral-100 flex items-center justify-center text-gray-500 transition-transform hover:scale-110';
  eyeBtn.title = isHidden ? 'Mostrar este punto' : 'Ocultar este punto';
  eyeBtn.innerHTML = isHidden ? ICONS.eyeOff : ICONS.eye;

  toolbar.appendChild(editBtn);
  toolbar.appendChild(eyeBtn);
  itemEl.appendChild(toolbar);

  // Edición del item
  let isEditing = false;
  editBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isEditing) return;
    isEditing = true;
    toolbar.classList.add('hidden');

    const currentRaw = itemEl.dataset.editableRaw || textTarget.textContent?.trim() || '';

    const editBox = document.createElement('div');
    editBox.className = 'w-full my-2 p-2.5 bg-white rounded-xl border-2 border-[#af0b56] shadow-md z-30 font-sans space-y-2';

    const textarea = document.createElement('textarea');
    textarea.className = 'textarea w-full text-base font-normal text-[#1d1d1b] bg-white border border-black/15 rounded-lg p-2.5 focus:outline-none focus:border-[#af0b56] min-h-[90px] resize-y';
    textarea.value = currentRaw;

    const row = document.createElement('div');
    row.className = 'flex items-center justify-end gap-1.5 pt-1';

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'btn btn-xs btn-ghost text-gray-600 rounded-lg inline-flex items-center gap-1';
    cancelBtn.innerHTML = `${ICONS.x} Cancelar`;

    const saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'btn btn-xs bg-[#af0b56] hover:bg-[#8f0946] text-white rounded-lg inline-flex items-center gap-1 font-bold';
    saveBtn.innerHTML = `${ICONS.check} Guardar`;

    row.appendChild(cancelBtn);
    row.appendChild(saveBtn);
    editBox.appendChild(textarea);
    editBox.appendChild(row);

    const originalDisplay = textTarget.style.display;
    textTarget.style.display = 'none';
    textTarget.parentNode?.insertBefore(editBox, textTarget.nextSibling);

    textarea.focus();

    async function handleSave() {
      const newText = textarea.value.trim();
      notifyStatus('saving', 'Guardando punto...');
      saveBtn.disabled = true;

      try {
        const fallbackItems = collectListFallbackItems(listEl);
        const res = await fetch('/api/admin/page-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'save-list-item',
            pageId,
            listKey,
            itemId,
            text: newText,
            fallbackItems,
          }),
        });

        const result = await res.json();
        if (!res.ok || !result.success) {
          throw new Error(result.error || 'Error al guardar el punto');
        }

        itemEl.dataset.editableRaw = newText;
        textTarget.innerHTML = renderMarkdownText(newText, false);
        editBox.remove();
        textTarget.style.display = originalDisplay;
        toolbar.classList.remove('hidden');
        isEditing = false;
        notifyStatus('saved', 'Punto actualizado y publicado');
      } catch (err: any) {
        console.error('Error guardando item:', err);
        notifyStatus('error', err.message || 'Error al guardar');
        saveBtn.disabled = false;
      }
    }

    function handleCancel() {
      editBox.remove();
      textTarget.style.display = originalDisplay;
      toolbar.classList.remove('hidden');
      isEditing = false;
    }

    saveBtn.addEventListener('click', handleSave);
    cancelBtn.addEventListener('click', handleCancel);

    textarea.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' && (ev.ctrlKey || ev.metaKey)) {
        ev.preventDefault();
        handleSave();
      } else if (ev.key === 'Escape') {
        ev.preventDefault();
        handleCancel();
      }
    });
  });

  // Visibilidad del item
  eyeBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    notifyStatus('saving', 'Actualizando visibilidad del punto...');
    eyeBtn.disabled = true;

    try {
      const fallbackItems = collectListFallbackItems(listEl);
      const res = await fetch('/api/admin/page-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle-list-item-visibility',
          pageId,
          listKey,
          itemId,
          fallbackItems,
        }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Error al cambiar visibilidad');
      }

      const nowHidden = result.item?.hidden ?? false;
      itemEl.setAttribute('data-editable-hidden', nowHidden ? 'true' : 'false');
      eyeBtn.innerHTML = nowHidden ? ICONS.eyeOff : ICONS.eye;
      eyeBtn.title = nowHidden ? 'Mostrar este punto' : 'Ocultar este punto';

      notifyStatus('saved', nowHidden ? 'Punto ocultado' : 'Punto visible');
    } catch (err: any) {
      console.error('Error alternando visibilidad de item:', err);
      notifyStatus('error', err.message || 'Error al cambiar visibilidad');
    } finally {
      eyeBtn.disabled = false;
    }
  });
}

function openAddItemForm(container: HTMLElement, listEl: HTMLElement, pageId: string, listKey: string) {
  const formBox = document.createElement('div');
  formBox.className = 'w-full my-3 p-4 bg-white/95 rounded-2xl border-2 border-[#af0b56] shadow-xl space-y-3 font-sans';

  const title = document.createElement('div');
  title.className = 'font-bold text-sm text-[#af0b56] flex items-center gap-1.5';
  title.innerHTML = `${ICONS.plus} Añadir nuevo punto a la lista`;

  const textarea = document.createElement('textarea');
  textarea.className = 'textarea w-full text-base font-normal text-[#1d1d1b] bg-white border border-black/15 rounded-xl p-3 focus:outline-none focus:border-[#af0b56] min-h-[100px] resize-y';
  textarea.placeholder = 'Redacta el nuevo punto... (puedes usar **negritas**)';

  const row = document.createElement('div');
  row.className = 'flex items-center justify-end gap-2';

  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.className = 'btn btn-xs btn-ghost text-gray-600 rounded-lg inline-flex items-center gap-1';
  cancelBtn.innerHTML = `${ICONS.x} Cancelar`;

  const submitBtn = document.createElement('button');
  submitBtn.type = 'button';
  submitBtn.className = 'btn btn-xs bg-[#af0b56] hover:bg-[#8f0946] text-white rounded-lg inline-flex items-center gap-1.5 font-bold shadow-xs';
  submitBtn.innerHTML = `${ICONS.check} Añadir y publicar`;

  row.appendChild(cancelBtn);
  row.appendChild(submitBtn);

  formBox.appendChild(title);
  formBox.appendChild(textarea);
  formBox.appendChild(row);

  container.style.display = 'none';
  container.parentNode?.insertBefore(formBox, container.nextSibling);
  textarea.focus();

  async function handleAdd() {
    const text = textarea.value.trim();
    if (!text) {
      textarea.focus();
      return;
    }

    notifyStatus('saving', 'Añadiendo punto a la lista...');
    submitBtn.disabled = true;

    try {
      const fallbackItems = collectListFallbackItems(listEl);
      const res = await fetch('/api/admin/page-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add-list-item',
          pageId,
          listKey,
          text,
          fallbackItems,
        }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Error al añadir el punto');
      }

      const newItem = result.item;

      // Crear nuevo elemento en el DOM clonando la plantilla del último elemento o creando uno nuevo
      const lastItem = listEl.querySelector<HTMLElement>('[data-editable-item-id]');
      let newLi: HTMLElement;

      if (lastItem) {
        newLi = lastItem.cloneNode(true) as HTMLElement;
        // Limpiar atributos y barras clonadas
        newLi.querySelectorAll('.inline-editor-toolbar').forEach((t) => t.remove());
        newLi.dataset.itemToolbarInitialized = 'false';
        newLi.dataset.editableItemId = newItem.id;
        newLi.dataset.editableRaw = newItem.text;
        newLi.setAttribute('data-editable-hidden', 'false');

        // Actualizar número o letra si tiene indicador
        const numSpan = newLi.querySelector('.font-londrina');
        const currentCount = listEl.querySelectorAll('[data-editable-item-id]').length + 1;
        if (numSpan) {
          const sample = lastItem.querySelector('.font-londrina')?.textContent?.trim() || '';
          if (/^[A-Za-z]$/.test(sample)) {
            numSpan.textContent = String.fromCharCode(64 + Math.min(26, currentCount));
          } else {
            numSpan.textContent = currentCount < 10 ? `0${currentCount}` : `${currentCount}`;
          }
        }

        // Actualizar texto
        const textTarget = newLi.querySelector('[data-editable-item-text]') || newLi;
        textTarget.innerHTML = renderMarkdownText(newItem.text, false);
      } else {
        newLi = document.createElement('li');
        newLi.className = 'p-4 bg-white/90 rounded-2xl border border-black/10';
        newLi.dataset.editableItemId = newItem.id;
        newLi.dataset.editableRaw = newItem.text;
        newLi.setAttribute('data-editable-hidden', 'false');
        newLi.innerHTML = renderMarkdownText(newItem.text, false);
      }

      listEl.appendChild(newLi);
      attachListItemToolbar(newLi, pageId, listKey, listEl);

      formBox.remove();
      container.style.display = '';
      notifyStatus('saved', 'Punto añadido y publicado con éxito');
    } catch (err: any) {
      console.error('Error al añadir item:', err);
      notifyStatus('error', err.message || 'Error al añadir punto');
      submitBtn.disabled = false;
    }
  }

  function handleClose() {
    formBox.remove();
    container.style.display = '';
  }

  submitBtn.addEventListener('click', handleAdd);
  cancelBtn.addEventListener('click', handleClose);

  textarea.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' && (ev.ctrlKey || ev.metaKey)) {
      ev.preventDefault();
      handleAdd();
    } else if (ev.key === 'Escape') {
      ev.preventDefault();
      handleClose();
    }
  });
}

function collectListFallbackItems(listEl: HTMLElement): Array<{ id: string; text: string; hidden?: boolean }> {
  const items: Array<{ id: string; text: string; hidden?: boolean }> = [];
  listEl.querySelectorAll<HTMLElement>('[data-editable-item-id]').forEach((el) => {
    const id = el.dataset.editableItemId || '';
    const textTarget = el.querySelector<HTMLElement>('[data-editable-item-text]') || el;
    const text = el.dataset.editableRaw || textTarget.textContent?.trim() || '';
    const hidden = el.getAttribute('data-editable-hidden') === 'true';
    if (id) {
      items.push({ id, text, hidden });
    }
  });
  return items;
}

// Iniciar al cargar el DOM o si ya cargó
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initInlineEditor());
  } else {
    initInlineEditor();
  }

  // Escuchar cambios de modo desde la barra flotante
  window.addEventListener('page-editor-mode-change', (e: any) => {
    const mode = e.detail?.mode;
    if (mode === 'editing') {
      initInlineEditor();
    }
  });
}
