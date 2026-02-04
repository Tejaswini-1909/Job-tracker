function DailyAgenda({ agenda, onMarkDone }) {
  const hasItems =
    agenda.interviewsToday.length ||
    agenda.interviewsTomorrow.length ||
    agenda.followUps.length ||
    agenda.overdue.length;

  return (
    <div style={styles.card}>
      <h3>📅 Today’s Agenda</h3>

      {!hasItems && (
        <p>🎉 You’re all caught up today!</p>
      )}

      {agenda.interviewsToday.length > 0 && (
        <>
          <h4>🎤 Interviews Today</h4>
          {agenda.interviewsToday.map((job) => (
            <p key={job._id}>
              {job.company} — {job.role}
            </p>
          ))}
        </>
      )}

      {agenda.interviewsTomorrow.length > 0 && (
        <>
          <h4>🟠 Interviews Tomorrow</h4>
          {agenda.interviewsTomorrow.map((job) => (
            <p key={job._id}>
              {job.company} — {job.role}
            </p>
          ))}
        </>
      )}

      {agenda.followUps.length > 0 && (
        <>
          <h4>📧 Follow-ups Due</h4>
          {agenda.followUps.map((job) => (
            <div key={job._id} style={styles.row}>
              <span>{job.company}</span>
              <button onClick={() => onMarkDone(job._id)}>
                ✅ Mark done
              </button>
            </div>
          ))}
        </>
      )}

      {agenda.overdue.length > 0 && (
        <>
          <h4>⚠️ Overdue</h4>
          {agenda.overdue.map((job) => (
            <p key={job._id}>
              {job.company} — Interview missed
            </p>
          ))}
        </>
      )}
    </div>
  );
}

const styles = {
  card: {
    padding: "15px",
    borderRadius: "8px",
    background: "#fff3cd",
    marginBottom: "20px"
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }
};

export default DailyAgenda;
