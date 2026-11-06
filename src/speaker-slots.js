(function (root) {
  var EMAIL = 'speaker@devdottalk.uk';

  function buildEmailDraft(date, name, session) {
    var subject = 'Speaker slot request: ' + date + (name ? ' - ' + name : '');
    var body = [
      'Hi {dev.talk} team,',
      '',
      'I would like to request the speaking slot on ' + date + '.',
      '',
      'Speaker: ' + (name || '[your name]'),
      'Session: ' + (session || '[your session title]'),
      '',
      'Please let me know if this date works.',
      '',
      'Thanks,',
      name || ''
    ].join('\n');
    return { subject: subject, body: body };
  }

  function buildMailto(date, name, session) {
    var draft = buildEmailDraft(date, name, session);
    return 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(draft.subject) + '&body=' + encodeURIComponent(draft.body);
  }

  function buildGmailComposeUrl(date, name, session) {
    var draft = buildEmailDraft(date, name, session);
    var params = new URLSearchParams({
      view: 'cm',
      fs: '1',
      to: EMAIL,
      su: draft.subject,
      body: draft.body
    });
    return 'https://mail.google.com/mail/?' + params.toString();
  }

  function buildOutlookComposeUrl(date, name, session) {
    var draft = buildEmailDraft(date, name, session);
    var params = new URLSearchParams({
      to: EMAIL,
      subject: draft.subject,
      body: draft.body
    });
    return 'https://outlook.office.com/mail/deeplink/compose?' + params.toString();
  }

  function buildCopyText(date, name, session) {
    var draft = buildEmailDraft(date, name, session);
    return 'To: ' + EMAIL + '\nSubject: ' + draft.subject + '\n\n' + draft.body;
  }

  function showCopyFallback(button, text) {
    var item = button.closest('.speaker-slots-item');
    var status = item && item.querySelector('[data-copy-status]');
    var fallback = item && item.querySelector('[data-copy-fallback]');
    if (fallback) {
      fallback.value = text;
      fallback.hidden = false;
      fallback.focus();
      fallback.select();
    }
    if (status) {
      status.textContent = 'Clipboard unavailable. Select and copy the email details below.';
    }
  }

  function init(doc, search, clipboard) {
    var params = new URLSearchParams(search);
    var name = (params.get('name') || '').trim();
    var session = (params.get('session') || '').trim();

    doc.querySelectorAll('[data-email-action]').forEach(function (link) {
      var date = link.getAttribute('data-slot-date');
      var action = link.getAttribute('data-email-action');
      var href = action === 'gmail' ? buildGmailComposeUrl(date, name, session) :
        action === 'outlook' ? buildOutlookComposeUrl(date, name, session) :
          buildMailto(date, name, session);
      link.setAttribute('href', href);
      if (action === 'gmail' || action === 'outlook') {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });

    doc.querySelectorAll('[data-copy-slot-date]').forEach(function (button) {
      button.addEventListener('click', async function () {
        var date = button.getAttribute('data-copy-slot-date');
        var text = buildCopyText(date, name, session);
        var clipboardApi = clipboard || (root.navigator && root.navigator.clipboard);
        var item = button.closest('.speaker-slots-item');
        var status = item && item.querySelector('[data-copy-status]');

        if (clipboardApi && typeof clipboardApi.writeText === 'function') {
          try {
            await clipboardApi.writeText(text);
            if (status) status.textContent = 'Email details copied.';
            return;
          } catch (error) {
            showCopyFallback(button, text);
            return;
          }
        }
        showCopyFallback(button, text);
      });
    });

    var summary = doc.querySelector('[data-speaker-summary]');
    var greeting = doc.querySelector('[data-speaker-greeting]');
    if (greeting && name) {
      greeting.textContent = 'Hi ' + name + ', thanks for volunteering to speak at {dev.talk}!';
    }
    if (summary && (name || session)) {
        summary.querySelector('[data-speaker-name]').textContent = name || 'Not provided';
        summary.querySelector('[data-speaker-session]').textContent = session || 'Not provided';
      summary.hidden = false;
    }
  }

  if (typeof document !== 'undefined' && root.location) {
    init(document, root.location.search);
  }

  if (typeof module !== 'undefined') {
    module.exports = {
      buildMailto: buildMailto,
      buildEmailDraft: buildEmailDraft,
      buildGmailComposeUrl: buildGmailComposeUrl,
      buildOutlookComposeUrl: buildOutlookComposeUrl,
      init: init
    };
  }
})(typeof window !== 'undefined' ? window : {});
