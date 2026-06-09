import { create } from 'zustand'

const useAppStore = create((set) => ({
  // Sidebar
  sidebarCollapsed: false,
  toggleSidebar: () => set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  // Audit log (local cache)
  auditLog: [],
  addAuditEntry: (entry) => set(s => ({
    auditLog: [{ id: Date.now(), timestamp: new Date().toISOString(), ...entry }, ...s.auditLog].slice(0, 200)
  })),
  clearLocalAudit: () => set({ auditLog: [] }),

  // Active member (for quick access across pages)
  activeMember: null,
  setActiveMember: (member) => set({ activeMember: member }),
}))

export default useAppStore