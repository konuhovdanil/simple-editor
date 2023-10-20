<template>
	<div class="file-item">
		<div
			class="file-item__head"
			:class="{ active: treeStore.activeElementId === id }"
			@click="setActiveElement"
		>
			{{ filename }}
			<span class="file-item__folder-icon" v-if="isDir">&#10550;</span>
		</div>

		<div class="file-item__childs">
			<file-item
				v-for="item in childs"
				:key="item.id"
				:id="item.id"
				:name="item.name"
				:extension="item.extension"
				:type="item.type"
				:code="item.code"
				:childs="item.childs"
				@update:path="updateActivePath"
			/>
		</div>
	</div>
</template>

<script setup>
import { useHierarchyTreeStore } from '@/stores/hierarchyTree'
import { computed, defineEmits, defineProps } from 'vue'

const props = defineProps({
	type: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	extension: {
		type: [String, null],
		default: null,
	},
	childs: {
		type: Array,
		default: () => [],
	},
	code: {
		type: String,
		default: '',
	},
	id: {
		type: String,
		required: true,
	},
})

const emit = defineEmits(['update:path'])

const treeStore = useHierarchyTreeStore()

const isDir = computed(() => props.type === 'dir')

const filename = computed(() => {
	const { name, extension } = props

	return isDir.value || extension.length === 0 ? name : `${name}.${extension}`
})

const updateActivePath = (dir = [], id = null) => {
	const data = {
		id: props.id,
		type: props.type,
		name: props.name,
		extension: props.extension,
	}

	if (props.type === 'file') data.code = props.code

	emit('update:path', [data, ...dir], id)
}

const setActiveElement = () => {
	updateActivePath([], props.id)
}
</script>

<style scoped lang="scss">
.file-item {
	user-select: none;

	&__head {
		display: flex;
		flex-direction: row;
		align-items: center;
		cursor: pointer;

		&:hover,
		&.active {
			background: #ddd;
		}
	}

	&__folder-icon {
		margin-left: 15px;
		transition: all 0.3s;
	}

	&__childs {
		padding-left: 15px;
	}
}
</style>
