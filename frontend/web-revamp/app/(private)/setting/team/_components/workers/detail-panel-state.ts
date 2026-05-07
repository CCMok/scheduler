export type DetailPanelState = 
 | { mode: DetailPanelMode.IDLE }
 | { mode: DetailPanelMode.CREATE }
 | { mode: DetailPanelMode.UPDATE, workerId: number }

export enum DetailPanelMode {
	IDLE,
	CREATE,
	UPDATE,
}