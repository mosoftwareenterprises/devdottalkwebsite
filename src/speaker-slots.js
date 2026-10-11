(function (root) {
  var EMAIL = 'speaker@devdottalk.uk';

  function buildMailto(date, name, session) {
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
    return 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }

  function init(doc, search) {
    var params = new URLSearchParams(search);
    var name = (params.get('name') || '').trim();
    var session = (params.get('session') || '').trim();

    doc.querySelectorAll('[data-slot-date]').forEach(function (link) {
      link.setAttribute('href', buildMailto(link.getAttribute('data-slot-date'), name, session));
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
    module.exports = { buildMailto: buildMailto, init: init };
  }
})(typeof window !== 'undefined' ? window : {});
