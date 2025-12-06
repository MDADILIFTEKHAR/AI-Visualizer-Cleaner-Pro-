
// Mock Email Service
// In a real application, this would call a backend API (e.g., SendGrid, AWS SES)

export const sendWelcomeEmail = async (email: string, name: string): Promise<boolean> => {
  return new Promise((resolve) => {
    // Simulate network delay for sending email
    setTimeout(() => {
      const emailContent = `
      ----------------------------------------------------
      📨 [MOCK EMAIL SERVER] Sending to: ${email}
      ----------------------------------------------------
      Subject: 🚀 Welcome to AI Visualizer Pro, ${name}!
      
      Hi ${name},

      Welcome to the future of data science! 
      We are thrilled to have you on board.
      
      Your account has been successfully created. You can now:
      1. Upload CSV/Excel files
      2. Use AI to clean your data
      3. Generate stunning visualizations

      Get started by uploading your first dataset!

      Cheers,
      The AI Visualizer Team
      ----------------------------------------------------
      `;
      
      console.log(emailContent);
      resolve(true);
    }, 1000);
  });
};
