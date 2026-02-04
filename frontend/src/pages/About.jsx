function About() {
  return (
    <div style={styles.page}>
      <h2>ℹ️ About Job Tracker</h2>

      <section style={styles.section}>
        <h3>🚀 What is Job Tracker?</h3>
        <p>
          Job Tracker is a smart web application that helps users manage
          their job applications, interviews, follow-ups, and career
          preparation in one place.
        </p>
      </section>

      <section style={styles.section}>
        <h3>✨ Key Features</h3>
        <ul>
          <li>🧾 Track job applications (Applied / Interview / Offer / Rejected)</li>
          <li>📅 Interview scheduling with reminders</li>
          <li>⏰ Daily agenda and follow-ups</li>
          <li>📝 Sticky notes for interview preparation</li>
          <li>📤 Export jobs to CSV</li>
          <li>🧠 Resume analyzer with missing skill detection</li>
          <li>🗄️ Archive completed or old jobs</li>
          <li>📊 Analytics for interview & offer rate</li>
        </ul>
      </section>

      <section style={styles.section}>
        <h3>🎨 Color & Symbol Guide</h3>
        <ul>
          <li><span style={{ color: "red" }}>🔴 Red</span> – Interview today / very urgent</li>
          <li><span style={{ color: "orange" }}>🟠 Orange</span> – Interview in next 1–3 days</li>
          <li><span style={{ color: "green" }}>🟢 Green</span> – Offer / safe stage</li>
          <li><span style={{ color: "#0077cc" }}>🔵 Blue</span> – Applied (waiting)</li>
          <li><span style={{ color: "gray" }}>⚪ Gray</span> – Rejected / archived</li>
        </ul>
      </section>

      <section style={styles.section}>
        <h3>👩‍💻 Developer</h3>
        <p><b>Name:</b> Tejaswini Sharma</p>
        <p><b>Role:</b> Full Stack Developer</p>
        <p><b>Tech Stack:</b> React, Node.js, Express, MongoDB</p>
        <p>
          This project is built to solve real-world job-track problems
          and demonstrate full-stack development skills.
        </p>
      </section>
    </div>
  );
}

const styles = {
  page: {
    maxWidth: "900px",
    margin: "100px auto",
    padding: "20px"
  },
  section: {
    
  marginBottom: 25,
  background: "#fff6dc",              // soft pastel background
  padding: "18px 20px",
  borderRadius: 14,
  boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
  border: "1px solid rgba(0,0,0,0.05)"
  }


};

export default About;
