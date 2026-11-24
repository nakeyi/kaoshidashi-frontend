const STORAGE_KEY = 'exam-master-qa-conversations-v1';
const mathProblem = '求二次函数 y = x² − 4x + 3 与 x 轴的交点。我会画大致图像，但不知道第一步怎么列式。';
const tasks = {
  hint: {
    label: '提示',
    sample: mathProblem,
    sections: [['先抓住交点的特点', '点在 x 轴上时，纵坐标 y 等于多少？'], ['试着写下一步', '把这个 y 值代入函数，写出只含 x 的方程，再想想常数项 3 能拆成哪两个整数的乘积。']]
  },
  steps: {
    label: '讲解',
    sample: mathProblem,
    sections: [['找到交点的条件', '点在 x 轴上时 y = 0，所以 x² − 4x + 3 = 0。'], ['解方程', '找乘积为 3、和为 −4 的两个数，得到 (x − 1)(x − 3) = 0，因此 x = 1 或 x = 3。'], ['写成坐标并验算', '交点是 (1, 0) 和 (3, 0)。把两个 x 值代回原函数，y 都等于 0。']]
  },
  check: {
    label: '纠错',
    sample: '求 y = x² − 4x + 3 与 x 轴的交点。我令 y = 0，然后分解成 (x + 1)(x + 3) = 0，所以 x = −1 或 −3。是哪一步错了？',
    sections: [['正确的一步', '求与 x 轴的交点，应令 y = 0。'], ['第一处错误', '展开 (x + 1)(x + 3)，一次项是 +4x，而原式的一次项是 −4x。'], ['怎么自查', '重新选两个乘积为 3、和为 −4 的数。分解后先展开核对符号，再解方程。']]
  },
  lab: {
    label: '实验',
    sample: '我想探究摆长是否影响单摆周期。用同一个摆球，初始偏角都约为 5°。摆长 20、40、60 cm 时，10 次完整摆动分别耗时约 9.0、12.7、15.5 s。怎么分析这些数据？',
    sections: [['分清变量', '摆长是改变的条件。摆球和初始偏角保持一致，比较的是单摆周期。'], ['用数据说明现象', '用总时间除以 10，得到周期约 0.90、1.27、1.55 s。这三组观测中，摆长增加时，周期也增加。'], ['改进与限制', '每种摆长可重复测量几次并取平均，减少计时波动。这三组数据支持趋势，单凭它们难以确定精确的函数关系。']]
  }
};
const tools = {
  explain: { label: '分步解析', placeholder: '输入题目，或上传文件…' },
  review: { label: '检查作答', placeholder: '输入你的答案，如「我的答案：1，3」。有题目也可以一起发…' },
  summary: { label: '方法总结', placeholder: '输入题目，或直接发送来总结当前这道题…' },
  practice: { label: '同类练习', placeholder: '输入一道例题，或直接发送来练习当前题型…' }
};
const getToolLabel = id => tools[id]?.label || tasks[id]?.label;
const fallback = '已记录这道题。当前页面可以在本地解一元二次方程，其他题目需要接入 AI 解题服务。';
const workspace = document.getElementById('workspace');
const historySearch = document.getElementById('history-search');
const historyDialog = document.getElementById('history-dialog');
const searchResults = document.getElementById('search-results-list');
const openHistorySearch = document.getElementById('open-history-search');
const historyPanel = document.getElementById('history');
const historyList = document.getElementById('history-list');
const historyToggle = document.querySelector('.history-toggle');
const newQuestion = document.getElementById('new-question');
const emptyHistory = document.getElementById('empty-history');
const welcome = document.getElementById('welcome');
const messages = document.getElementById('messages');
const scrollArea = document.getElementById('conversation-scroll');
const composer = document.getElementById('composer');
const question = document.getElementById('question');
const fileInput = document.getElementById('question-file');
const attachButton = document.getElementById('attach-file');
const attachToggle = document.getElementById('attach-toggle');
const attachMenu = document.getElementById('attach-menu');
const sideChat = document.getElementById('side-chat');
const sideChatTabs = document.getElementById('side-chat-tabs');
const sideChatContent = document.getElementById('side-chat-content');
const addSideTabButton = document.getElementById('add-side-tab');
const openSideChat = document.getElementById('open-side-chat');
const closeSideChat = document.getElementById('close-side-chat');
const isSideChat = new URLSearchParams(location.search).get('panel') === '1';
document.body.classList.toggle('is-side-chat', isSideChat);
openSideChat.hidden = isSideChat;
const toolItems = [...composer.querySelectorAll('.tool-item')].map(item => ({
  item,
  button: item.querySelector('[data-tool]'),
  clear: item.querySelector('.clear-tool')
}));
const sendButton = composer.querySelector('button[type="submit"]');
const attachmentCard = document.getElementById('attachment');
const attachmentName = document.getElementById('attachment-name');
const attachmentSize = document.getElementById('attachment-size');
const attachmentImage = document.getElementById('attachment-image');
const attachmentStatus = document.getElementById('attachment-status');
const storageStatus = document.getElementById('storage-status');
const announcement = document.getElementById('announcement');
const dateFormat = new Intl.DateTimeFormat('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
const conversationId = () => window.crypto?.randomUUID?.() || Date.now() + '-' + Math.random().toString(36).slice(2);
let currentId = null;
let attachment = null;
let previewUrl = null;
let sending = false;
let selectedTool = null;
const sideTabs = [];
let activeSideTab = null;
let storageAvailable = true;
let conversations = readConversations();

function useTemporaryStorage() {
  storageAvailable = false;
  storageStatus.textContent = '此浏览器无法保存答疑记录，刷新后将清空。';
  storageStatus.hidden = false;
}

function readConversations() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (Array.isArray(data)) return data;
  } catch {
    useTemporaryStorage();
  }
  return [];
}

function recordQuestion(prompt, file, tool, problem, reply) {
  if (storageAvailable) {
    const latest = readConversations();
    if (storageAvailable) conversations = latest;
  }
  let conversation = conversations.find(item => item.id === currentId);
  if (!conversation) {
    conversation = { id: conversationId(), title: prompt || file.name, updated: 0, messages: [] };
    currentId = conversation.id;
    conversations.push(conversation);
  }
  conversation.task = tool;
  conversation.messages.push(
    { who: 'user', text: prompt, file, task: tool, problem },
    { who: 'ai', text: reply.text, sections: reply.sections, practiceAnswer: reply.practiceAnswer }
  );
  conversation.updated = Date.now();
  if (storageAvailable) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch {
      useTemporaryStorage();
    }
  }
  question.value = '';
  clearAttachment();
  render();
  const replyTop = messages.lastElementChild.getBoundingClientRect().top;
  const viewportTop = scrollArea.getBoundingClientRect().top;
  if (replyTop < viewportTop) scrollArea.scrollTop -= viewportTop - replyTop + 8;
  announcement.textContent = reply.text;
}

function setHistoryOpen(open) {
  historyPanel.classList.toggle('is-open', open);
  historyToggle.setAttribute('aria-expanded', String(open));
}

function openConversation(item) {
  if (historyDialog.open) historyDialog.close();
  currentId = item.id;
  question.value = '';
  clearAttachment();
  selectTool(Object.hasOwn(tools, item.task) ? item.task : null);
  setHistoryOpen(false);
  render();
  question.focus();
}

function createRecord(item) {
  const row = document.createElement('li');
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'record';
  if (item.id === currentId) button.setAttribute('aria-current', 'true');
  const title = document.createElement('strong');
  title.textContent = item.title;
  const time = document.createElement('time');
  time.dateTime = new Date(item.updated).toISOString();
  const label = getToolLabel(item.task);
  time.textContent = label ? label + ' · ' + dateFormat.format(item.updated) : dateFormat.format(item.updated);
  button.append(title, time);
  button.addEventListener('click', () => openConversation(item));
  row.append(button);
  return row;
}

function newestFirst(items) {
  return [...items].sort((a, b) => b.updated - a.updated);
}

function renderHistory() {
  historyList.replaceChildren(...newestFirst(conversations).map(createRecord));
  if (historyDialog.open) renderSearch();
}

function renderSearch() {
  const query = historySearch.value.trim().toLocaleLowerCase();
  const terms = query ? query.split(/\s+/) : [];
  const matching = terms.length ? conversations.filter(item => {
    const content = [
      item.title,
      getToolLabel(item.task),
      ...item.messages.flatMap(message => [message.text, message.file?.name, getToolLabel(message.task)])
    ].join(' ').toLocaleLowerCase();
    return terms.every(term => content.includes(term));
  }) : conversations;
  searchResults.replaceChildren(...newestFirst(matching).map(createRecord));
  emptyHistory.textContent = query ? '没有匹配的答疑记录。' : '还没有答疑记录。';
  emptyHistory.hidden = matching.length > 0;
}

function showHistorySearch() {
  if (isSideChat || historyDialog.open) return;
  historySearch.value = '';
  renderSearch();
  historyDialog.showModal();
  historySearch.focus();
}

function fitQuestion() {
  question.style.height = 'auto';
  question.style.height = question.scrollHeight + 'px';
}

function render() {
  fitQuestion();
  const active = conversations.find(item => item.id === currentId);
  welcome.hidden = Boolean(active);
  workspace.classList.toggle('is-start', !active);
  renderHistory();
  messages.replaceChildren(...(active?.messages || []).map(message => {
    const row = document.createElement('li');
    row.className = message.who === 'user' ? 'message user' : 'message';
    const name = document.createElement('b');
    const label = getToolLabel(message.task);
    name.textContent = message.who === 'user' ? (label ? '我 · ' + label : '我') : 'AI 演示';
    const content = document.createElement('div');
    content.className = 'message-body';
    if (message.sections) {
      for (const [title, body] of message.sections) {
        const section = document.createElement('div');
        section.className = 'answer-section';
        const heading = document.createElement('h3');
        heading.textContent = title;
        const paragraph = document.createElement('p');
        paragraph.textContent = body;
        section.append(heading, paragraph);
        content.append(section);
      }
      if (message.practiceAnswer) {
        const details = document.createElement('details');
        details.className = 'practice-answer';
        const summary = document.createElement('summary');
        summary.textContent = '查看参考答案';
        const paragraph = document.createElement('p');
        paragraph.textContent = message.practiceAnswer;
        details.append(summary, paragraph);
        content.append(details);
      }
    } else {
      if (message.file) {
        const fileLabel = document.createElement('strong');
        fileLabel.className = 'message-file';
        fileLabel.textContent = message.file.name + ' · ' + formatSize(message.file.size);
        content.append(fileLabel);
      }
      if (!message.text) {
        row.append(name, content);
        return row;
      }
      const paragraph = document.createElement('p');
      paragraph.textContent = message.text;
      content.append(paragraph);
    }
    row.append(name, content);
    return row;
  }));
  scrollArea.scrollTop = scrollArea.scrollHeight;
}

function formatSize(bytes) {
  return bytes < 1024 * 1024
    ? Math.max(1, Math.ceil(bytes / 1024)) + ' KB'
    : (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function showAttachmentStatus(message = '') {
  attachmentStatus.textContent = message;
  attachmentStatus.hidden = !message;
}

function clearAttachment() {
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  previewUrl = null;
  attachment = null;
  attachmentImage.removeAttribute('src');
  attachmentImage.hidden = true;
  attachmentName.textContent = '';
  attachmentSize.textContent = '';
  attachmentCard.hidden = true;
  fileInput.value = '';
  showAttachmentStatus();
}

function setAttachMenu(open) {
  attachMenu.hidden = !open;
  attachToggle.setAttribute('aria-expanded', String(open));
}

function selectSideTab(selected) {
  activeSideTab = selected;
  for (const tab of sideTabs) {
    const active = tab === selected;
    tab.button.setAttribute('aria-selected', String(active));
    tab.button.tabIndex = active ? 0 : -1;
    tab.panel.hidden = !active;
  }
  selected.button.focus();
}

function addSideTab() {
  const number = sideTabs.length + 1;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'side-chat-tab';
  button.id = 'side-chat-tab-' + number;
  button.textContent = '问答 ' + number;
  button.setAttribute('role', 'tab');

  const panel = document.createElement('div');
  panel.className = 'side-tab-page';
  panel.id = 'side-tab-page-' + number;
  panel.setAttribute('role', 'tabpanel');
  panel.setAttribute('aria-labelledby', button.id);
  button.setAttribute('aria-controls', panel.id);

  const frame = document.createElement('iframe');
  frame.title = '侧栏问答 ' + number;
  frame.src = 'qa.html?panel=1';
  panel.append(frame);

  const tab = { button, panel, frame };
  sideTabs.push(tab);
  button.addEventListener('click', () => selectSideTab(tab));
  sideChatTabs.append(button);
  sideChatContent.append(panel);
  selectSideTab(tab);
}

sideChatTabs.addEventListener('keydown', event => {
  const index = sideTabs.findIndex(tab => tab.button === event.target);
  if (index < 0) return;
  const count = sideTabs.length;
  const targets = { ArrowLeft: (index - 1 + count) % count, ArrowRight: (index + 1) % count, Home: 0, End: count - 1 };
  if (!Object.hasOwn(targets, event.key)) return;
  event.preventDefault();
  selectSideTab(sideTabs[targets[event.key]]);
});
addSideTabButton.addEventListener('click', addSideTab);

function setSideChat(open) {
  if (isSideChat) return;
  sideChat.hidden = !open;
  workspace.classList.toggle('has-side-chat', open);
  fitQuestion();
  openSideChat.setAttribute('aria-expanded', String(open));
  if (!open) attachToggle.focus();
  else if (activeSideTab) activeSideTab.button.focus();
  else addSideTab();
}

attachToggle.addEventListener('click', () => setAttachMenu(attachMenu.hidden));
attachButton.addEventListener('click', () => {
  setAttachMenu(false);
  attachToggle.focus();
  fileInput.click();
});
openSideChat.addEventListener('click', () => {
  setAttachMenu(false);
  setSideChat(true);
});
closeSideChat.addEventListener('click', () => setSideChat(false));
document.addEventListener('click', event => {
  if (!attachMenu.hidden && !event.target.closest('.attach-actions')) setAttachMenu(false);
});
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || historyDialog.open) return;
  if (!attachMenu.hidden) {
    setAttachMenu(false);
    attachToggle.focus();
  } else if (!sideChat.hidden) {
    setSideChat(false);
  } else if (isSideChat && window.parent !== window) {
    window.parent.postMessage('close-side-chat', '*');
  }
});
window.addEventListener('message', event => {
  if (!sideChat.hidden && event.source === activeSideTab?.frame.contentWindow && event.data === 'close-side-chat') setSideChat(false);
});
document.getElementById('remove-file').addEventListener('click', () => {
  clearAttachment();
  attachToggle.focus();
});
function attachQuestionFile(file) {
  if (!/\.(jpe?g|png|webp|gif|pdf|txt)$/i.test(file.name)) {
    showAttachmentStatus('请选择图片、PDF 或 TXT 文件。');
    return;
  }
  if (!file.size || file.size > 10 * 1024 * 1024) {
    showAttachmentStatus(file.size ? '文件不能超过 10 MB。' : '文件为空，请重新选择。');
    return;
  }
  clearAttachment();
  attachment = file;
  attachmentName.textContent = file.name;
  attachmentSize.textContent = formatSize(file.size);
  if (/\.(jpe?g|png|webp|gif)$/i.test(file.name)) {
    previewUrl = URL.createObjectURL(file);
    attachmentImage.src = previewUrl;
    attachmentImage.hidden = false;
  }
  attachmentCard.hidden = false;
}
fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  fileInput.value = '';
  if (file) attachQuestionFile(file);
});

if (isSideChat && window.parent !== window && new URLSearchParams(location.search).get('capture') === '1') {
  window.addEventListener('message', event => {
    const image = event.data;
    const sameOrigin = event.origin === location.origin || (location.protocol === 'file:' && event.origin === 'null');
    if (event.source !== window.parent || !sameOrigin || image?.type !== 'screenshot-question-image') return;
    if (!(image.blob instanceof Blob) || image.blob.type !== 'image/jpeg' || typeof image.name !== 'string') return;
    attachQuestionFile(new File([image.blob], image.name, { type: image.blob.type }));
    question.focus();
  });
  window.parent.postMessage('screenshot-question-ready', location.protocol === 'file:' ? '*' : location.origin);
}
attachmentImage.addEventListener('error', () => {
  attachmentImage.hidden = true;
  showAttachmentStatus('图片无法预览，请检查文件或重新选择。');
});

function parseQuadratic(text) {
  const normalized = text.replace(/[ \t]/g, '').replace(/[−－]/g, '-').replace(/²/g, '^2');
  const match = normalized.match(/(?:^|[^\da-z.+*/^-])(y=)?([+-]?\d{0,6})x\^2([+-]\d{0,6}x)?([+-]\d{1,6})?(=0)?(?=$|[^\da-z=.+*/^-])/i);
  if (!match || (!match[5] && !(match[1] && /x轴/i.test(normalized)))) return null;
  const coefficient = value => Number(value === '+' || value === '-' || value === '' ? value + '1' : value);
  const a = coefficient(match[2]);
  const b = match[3] ? coefficient(match[3].slice(0, -1)) : 0;
  const c = Number(match[4] || 0);
  return a === 0 ? null : { a, b, c, intercept: Boolean(match[1]) };
}

function rootsOf({ a, b, c }) {
  const delta = b * b - 4 * a * c;
  if (delta < 0) return [];
  if (delta === 0) return [-b / (2 * a)];
  return [(-b - Math.sqrt(delta)) / (2 * a), (-b + Math.sqrt(delta)) / (2 * a)];
}

function explainQuadratic({ a, b, c, intercept }) {
  const delta = b * b - 4 * a * c;
  const roots = rootsOf({ a, b, c });
  let result = '判别式小于 0，方程没有实数根。';
  if (delta === 0) {
    result = '方程有一个重根，x = ' + (-b / (2 * a)) + '。';
  } else if (delta > 0) {
    const [first, second] = roots.map(value => Number(value.toFixed(8)));
    const equals = roots[0] === first && roots[1] === second ? ' = ' : ' ≈ ';
    result = '代入求根公式，得到 x₁' + equals + first + '，x₂' + equals + second + '。';
  }
  if (intercept) result += '每个实数根对应 x 轴上一个交点，纵坐标为 0。';
  return [
    ['确定系数', (intercept ? '先令 y = 0。' : '') + 'a = ' + a + '，b = ' + b + '，c = ' + c + '。'],
    ['计算判别式', 'Δ = b² − 4ac = ' + delta + '。'],
    ['写出结果', result]
  ];
}

function selectTool(tool) {
  selectedTool = tool;
  question.placeholder = tools[tool || 'explain'].placeholder;
  for (const { item, button, clear } of toolItems) {
    const active = button.dataset.tool === tool;
    item.hidden = tool !== null && !active;
    item.classList.toggle('is-selected', active);
    button.setAttribute('aria-pressed', String(active));
    clear.hidden = !active;
  }
}

for (const { button, clear } of toolItems) {
  button.addEventListener('click', () => {
    selectTool(selectedTool === button.dataset.tool ? null : button.dataset.tool);
    question.focus();
  });
  clear.addEventListener('click', () => {
    selectTool(null);
    button.focus();
  });
}

function currentProblem() {
  const conversation = conversations.find(item => item.id === currentId);
  const lastQuestion = conversation?.messages.findLast(message => message.who === 'user');
  if (!lastQuestion) return null;
  return Object.hasOwn(lastQuestion, 'problem') ? lastQuestion.problem : parseQuadratic(lastQuestion.text || '');
}

function parseStudentAnswer(text) {
  const values = text.trim().replace(/[。！!]+$/, '').replace(/[−－]/g, '-')
    .replace(/^(?:我的答案|我的作答|我算得)\s*[:：]\s*/, '')
    .replace(/x[₁₂12]?\s*[=≈]\s*/gi, '');
  if (/^(?:无解|无实数根|没有实数根|没有实数解)$/.test(values)) return [];
  const parts = values.split(/[,，、;；或\s]+/).filter(Boolean);
  if (!parts.length || parts.length > 2 || !parts.every(part => /^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(part))) return null;
  const numbers = parts.map(Number);
  return numbers.every(Number.isFinite) ? [...new Set(numbers)].sort((a, b) => a - b) : null;
}

function answerPart(text) {
  return text.match(/(?:我的答案|我的作答|我算得)\s*[:：]\s*([\s\S]+)/)?.[1] || '';
}

function reviewAnswer(problem, entered) {
  const expected = rootsOf(problem).sort((a, b) => a - b);
  const tolerance = expected.length === 2 ? Math.min(.005, (expected[1] - expected[0]) / 4) : .005;
  const matches = (value, root) => Math.abs(value - root) <= (Number.isInteger(value) ? 1e-8 : tolerance);
  const label = problem.intercept ? '交点横坐标' : '实数根';
  if (!entered) return [['还需要你的答案', '请发来你算出的' + label + '，例如「我的答案：1，3」。如果无实数根，可直接写「无实数根」。']];
  if (entered.length === expected.length && entered.every((value, index) => matches(value, expected[index]))) {
    return [['作答正确', expected.length ? '你填写的' + label + '与结果相符。' : '判别式小于 0，确实没有实数根。']];
  }
  const additional = entered.filter(value => !expected.some(root => matches(value, root)));
  const missing = expected.filter(root => !entered.some(value => matches(value, root)));
  const feedback = [];
  if (additional.length) feedback.push('请代回原方程核对 ' + additional.join('、') + '。');
  if (missing.length) feedback.push('还有' + (expected.length === 2 && missing.length === 1 ? '一个' : '') + '实数根需要检查。');
  if (entered.length && expected.length === 0) feedback.push('判别式小于 0，先检查是否会出现实数根。');
  if (!entered.length) feedback.push('判别式≥0，可以得到实数解。');
  return [['再检查一下', feedback.join('') || '请核对实数根的个数。']];
}

function summarizeProblem(problem) {
  const sections = [
    ['先化成标准式', (problem.intercept ? '求与 x 轴的交点，先令 y = 0，再' : '先') + '写成 ax² + bx + c = 0，确认 a ≠ 0。'],
    ['选择求解方法', '能容易地因式分解时，可以先因式分解。否则算 Δ = b² − 4ac，再用求根公式。'],
    ['验算结果', '将每个实数根代回原方程，核对符号和根的个数。' + (problem.intercept ? '最后把实数根写成交点 (x, 0)。' : '')]
  ];
  return sections;
}

function makePractice(problem) {
  const count = rootsOf(problem).length;
  const pairs = [[[2, 5], [4, 8]], [[-6, 9], [-8, 16]], [[-5, 6], [-7, 12]]][count];
  const sameProblem = problem.a === 1 && problem.b === pairs[0][0] && problem.c === pairs[0][1];
  const [b, c] = pairs[sameProblem ? 1 : 0];
  const next = { a: 1, b, c, intercept: problem.intercept };
  const expression = 'x² ' + (b < 0 ? '− ' : '+ ') + Math.abs(b) + 'x + ' + c;
  const task = next.intercept ? '求 y = ' + expression + ' 与 x 轴的交点。' : '解方程 ' + expression + ' = 0。';
  return { next, sections: [['试一题', task], ['做完核对', '选「检查作答」，发来你算出的' + (next.intercept ? '交点横坐标' : '实数根') + '。']], answer: explainQuadratic(next).at(-1)[1] };
}

function answerQuestion(tool, source, prompt, file, previous, useCurrent) {
  const entered = parseStudentAnswer(prompt);
  const resumeReview = tool === 'review' && !file && entered !== null;
  let problem = parseQuadratic(source) || (useCurrent || resumeReview ? previous : null);
  let sections;
  let practiceAnswer;
  if (problem) {
    if (tool === 'review') {
      sections = reviewAnswer(problem, parseStudentAnswer(answerPart(prompt) || answerPart(source)) ?? entered);
    } else if (tool === 'summary') {
      sections = summarizeProblem(problem);
    } else if (tool === 'practice') {
      const practice = makePractice(problem);
      sections = practice.sections;
      practiceAnswer = practice.answer;
      problem = practice.next;
    } else {
      sections = explainQuadratic(problem);
    }
  } else if (tool === 'explain') {
    sections = Object.values(tasks).find(task => task.sample === source)?.sections;
  }
  const unsupported = tool === 'review' && entered !== null
    ? '请先发一道可识别的题目，再检查作答。'
    : fallback;
  const text = sections?.map(([title, body]) => title + '。' + body).join('\n\n') || unsupported;
  return { problem, sections, practiceAnswer, text };
}

question.addEventListener('input', fitQuestion);
window.addEventListener('resize', fitQuestion);
historySearch.addEventListener('input', renderSearch);
openHistorySearch.addEventListener('click', showHistorySearch);
document.getElementById('close-history-search').addEventListener('click', () => historyDialog.close());
historyDialog.addEventListener('click', event => {
  if (event.target === historyDialog) historyDialog.close();
});
document.addEventListener('keydown', event => {
  if (isSideChat || !(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== 'k') return;
  event.preventDefault();
  showHistorySearch();
});
historyToggle.addEventListener('click', () => setHistoryOpen(!historyPanel.classList.contains('is-open')));
newQuestion.addEventListener('click', () => {
  currentId = null;
  question.value = '';
  clearAttachment();
  selectTool(null);
  setHistoryOpen(false);
  render();
  question.focus();
});
composer.addEventListener('submit', async event => {
  event.preventDefault();
  const prompt = question.value.trim();
  const file = attachment;
  const targetId = currentId;
  const choice = selectedTool;
  const tool = choice || 'explain';
  const previous = currentProblem();
  const useCurrent = !prompt && !file && previous && (tool === 'summary' || tool === 'practice');
  if (sending || (!prompt && !file && !useCurrent)) {
    if (!sending) question.focus();
    return;
  }
  const isText = file && /\.txt$/i.test(file.name);
  let source = prompt;
  if (isText) {
    sending = true;
    sendButton.disabled = true;
    attachButton.disabled = true;
    try {
      source = new TextDecoder('utf-8', { fatal: true }).decode(await file.arrayBuffer());
    } catch {
      if (attachment === file) showAttachmentStatus('无法读取 TXT。请确认文件使用 UTF-8 编码。');
      return;
    } finally {
      sending = false;
      sendButton.disabled = false;
      attachButton.disabled = false;
    }
    if (attachment !== file || targetId !== currentId) return;
  }
  const reply = answerQuestion(tool, source, prompt, file, previous, useCurrent);
  const fileDetails = file ? { name: file.name, size: file.size } : null;
  if (!reply.sections && file && !isText) {
    reply.text = '附件已加入答疑记录。当前页面无法识别图片或 PDF 中的题目，可把题目文字输入后再发送。';
  }
  const text = useCurrent ? tools[tool].label : prompt;
  recordQuestion(text, fileDetails, choice, reply.problem, reply);
  question.focus();
});
window.addEventListener('storage', event => {
  if (event.key !== STORAGE_KEY || !storageAvailable) return;
  conversations = readConversations();
  render();
});

render();
